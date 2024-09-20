import { FC, useState, useEffect } from 'react';
import { Input, Button, Spacer, Card, Table, Tooltip, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from '@nextui-org/react';
import { db } from '@/config/firebase'; // Adjust the path as necessary
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore'; // Updated Firestore imports
import { useNavigate } from 'react-router-dom'; // For navigation actions
import { EditIcon, DeleteIcon } from '@/components/icons'; // Replace with actual icon imports
import DefaultLayout from '@/layouts/default';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

// Define an interface for the class data
interface ClassData {
    id: string;
    Department: string;
    ClassName: string;
    clientId: string | null; // Make sure to include clientId as well
}

const ClassAdd: FC = () => {
    const [formData, setFormData] = useState<ClassData>({
        Department: '',
        ClassName: '',
        clientId: localStorage.getItem('clientId'), // Get clientId from localStorage
        id: '' // We'll use this for editing (if needed)
    });

    const [classes, setClasses] = useState<ClassData[]>([]); // Explicitly type the classes state
    const [departments, setDepartments] = useState<string[]>([]); // State to hold distinct departments
    const { t } = useTranslation(); // Initialize useTranslation hook
    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal control

    // Fetch the list of classes and departments from Firestore
    const fetchClassesAndDepartments = async () => {
        try {
            const storedClientId = localStorage.getItem('clientId');

            if (!storedClientId) {
                alert(t('client_id_not_found'));
                return;
            }

            // Query to filter class items by clientId
            const classesCollection = query(
                collection(db, 'class'),
                where('clientId', '==', storedClientId)
            );

            const querySnapshot = await getDocs(classesCollection);
            const fetchedClasses: ClassData[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<ClassData, 'id'> // Type assertion to map Firestore data
            }));

            setClasses(fetchedClasses); // Set the fetched data into the classes state

            // Extract distinct departments from the fetched classes
            const uniqueDepartments = [...new Set(fetchedClasses.map(cls => cls.Department))];
            setDepartments(uniqueDepartments); // Set unique departments for the select input
        } catch (e) {
            console.error('Error fetching classes:', e);
            alert('Failed to fetch classes. Please check your Firestore configuration.');
        }
    };

    // Fetch classes and departments on component mount
    useEffect(() => {
        fetchClassesAndDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add a new document with a generated ID
            await addDoc(collection(db, 'class'), formData);
            alert('Form submitted successfully!');
            setFormData({
                Department: '',
                ClassName: '',
                clientId: localStorage.getItem('clientId'), // Reset form with clientId
                id: ''
            });
            fetchClassesAndDepartments(); // Refresh the list of classes and departments after submission
            onOpenChange(); // Close the modal
        } catch (e) {
            alert('Error adding document: ' + e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const classToDelete = classes.find(cls => cls.id === id);
            if (classToDelete) {
                const confirmDelete = window.confirm(
                    `Are you sure you want to delete the class "${classToDelete.ClassName}"?`
                );
                if (confirmDelete) {
                    await deleteDoc(doc(db, 'class', id));
                    alert('Class deleted successfully');
                    setClasses(classes.filter(cls => cls.id !== id)); // Remove from state
                }
            }
        } catch (e) {
            console.error('Error deleting class: ', e);
            alert('Failed to delete class.');
        }
    };

    const handleEdit = (id: string) => {
        const classToEdit = classes.find(cls => cls.id === id);
        if (classToEdit) {
            setFormData({
                Department: classToEdit.Department,
                ClassName: classToEdit.ClassName,
                clientId: classToEdit.clientId,
                id: classToEdit.id
            });
            onOpen(); // Open the modal for editing
        }
    };

    const renderCell = (cls: ClassData, columnKey: keyof ClassData | 'actions') => {
        if (columnKey === 'actions') {
            return (
                <div className="relative flex justify-center items-center gap-2">
                    <Tooltip content={t('Edit Class')}>
                        <button aria-label={t('Edit Class')} onClick={() => handleEdit(cls.id)}>
                            <EditIcon />
                        </button>
                    </Tooltip>
                    <Tooltip content={t('Delete Class')} color="danger">
                        <button aria-label={t('Delete Class')} onClick={() => handleDelete(cls.id)}>
                            <DeleteIcon />
                        </button>
                    </Tooltip>
                </div>
            );
        }

        return <span>{cls[columnKey as keyof ClassData]}</span>;
    };

    const columns = [
        { name: t('Department'), uid: 'Department' },
        { name: t('Class Name'), uid: 'ClassName' },
        { name: t('Actions'), uid: 'actions' }
    ];

    return (
        <DefaultLayout>
            <div className='container'>
                <div className="flex mb-4">
                    <Button onPress={onOpen} color="primary">{t('Add Class')}</Button>
                </div>
                <Card>
                    <p className="text-2xl text-center font-bold">{t('Departments & Classes')}</p>
                    <Spacer y={2} />

                    <Table aria-label={t('Uploaded Classes')} style={{ height: 'auto', minWidth: '100%' }}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={classes}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(item, columnKey as keyof ClassData | 'actions')}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Modal for adding or editing class */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('Add/Edit Class')}</ModalHeader>
                            <ModalBody>
                                <Select
                                    name="Department"
                                    label={t('Department')}
                                    value={formData.Department}
                                    placeholder={t('Select Department')}
                                    onChange={handleChange}
                                    className="w-full rounded-md p-2 mb-4"
                                >
                                    {departments.map((dept, index) => (
                                        <SelectItem key={index} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label={t('Class Name')}
                                    name="ClassName"
                                    placeholder={t('Enter Class Name')}
                                    value={formData.ClassName}
                                    onChange={handleChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={onClose}>
                                    {t('Close')}
                                </Button>
                                <Button color="primary" onClick={handleSubmit}>
                                    {t('Submit')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </DefaultLayout>
    );
};

export default ClassAdd;
