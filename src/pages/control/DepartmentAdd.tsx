import { FC, useState, useEffect } from 'react';
import {
    Input,
    Button,
    Spacer,
    Card,
    Table,
    Tooltip,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from '@nextui-org/react';
import { db } from '@/config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { EditIcon, DeleteIcon } from '@/components/icons';
import DefaultLayout from '@/layouts/default';
import { useTranslation } from 'react-i18next';

interface DepartmentData {
    id: string;
    Department: string;
    clientId: string | null;
}

const Department: FC = () => {
    const [formData, setFormData] = useState<DepartmentData>({
        Department: '',
        clientId: localStorage.getItem('clientId'),
        id: ''
    });

    const [departments, setDepartments] = useState<DepartmentData[]>([]);
    const { t } = useTranslation();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const fetchDepartments = async () => {
        try {
            const storedClientId = localStorage.getItem('clientId');
            if (!storedClientId || storedClientId === "null") {
                alert(t('client_id_not_found'));
                return;
            }

            const departmentCollection = query(
                collection(db, 'Department'),
                where('clientId', '==', storedClientId)
            );

            const querySnapshot = await getDocs(departmentCollection);
            const fetchedDepartments: DepartmentData[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as Omit<DepartmentData, 'id'>
            }));

            setDepartments(fetchedDepartments);
        } catch (e) {
            console.error('Error fetching Departments:', e);
            alert('Failed to fetch departments. Please check your Firestore configuration.');
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const storedClientId = localStorage.getItem('clientId');
            if (!storedClientId || storedClientId === "null") {
                alert(t('client_id_not_found'));
                return;
            }
    
            formData.clientId = storedClientId; // Ensure clientId is set
    
            const departmentCollection = query(
                collection(db, 'Department'),
                where('Department', '==', formData.Department),
                where('clientId', '==', storedClientId)
            );
    
            const querySnapshot = await getDocs(departmentCollection);
    
            // If no existing department, add a new one
            if (!formData.id) {
                if (!querySnapshot.empty) {
                    alert('Department already exists!');
                    return;
                }
    
                // Add new department and retrieve the document reference
                const docRef = await addDoc(collection(db, 'Department'), formData);
                
                // Update the formData with the newly created document's ID
                await updateDoc(docRef, { id: docRef.id });
    
                alert('Department added successfully!');
            } else {
                // Update the existing department
                const departmentRef = doc(db, 'Department', formData.id);
                await updateDoc(departmentRef, {
                    Department: formData.Department,
                    clientId: formData.clientId
                });
                alert('Department updated successfully!');
            }
    
            // Reset formData and refresh the department list
            setFormData({
                Department: '',
                clientId: localStorage.getItem('clientId'),
                id: ''
            });
            fetchDepartments();
            onOpenChange();
        } catch (e) {
            alert('Error saving department: ' + e);
        }
    };
    
    const handleDelete = async (id: string) => {
        try {
            // Ensure the department ID is valid and exists
            const departmentToDelete = departments.find(dep => dep.id === id);
        
            if (!departmentToDelete) {
                console.error('Department not found for deletion, ID:', id);
                alert('Department not found.');
                return;
            }
    
            const confirmDelete = window.confirm(`Are you sure you want to delete the department "${departmentToDelete.Department}"?`);
            if (confirmDelete) {
                // Ensure the document path is valid: 'Department' is the collection, 'id' is the document
                const departmentDocRef = doc(db, 'Department', id);
    
                // Delete the document from Firestore using the correct document reference
                await deleteDoc(departmentDocRef);
        
                // Update the local state to remove the deleted department
                setDepartments(prev => prev.filter(dep => dep.id !== id));
    
                // Show success message
                alert('Department deleted successfully');
            }
        } catch (e) {
            console.error('Error deleting Department:', e);
            alert('Failed to delete Department.');
        }
    };
    
    const handleEdit = (id: string) => {
        const departmentToEdit = departments.find(dep => dep.id === id);
        if (departmentToEdit) {
            setFormData({
                Department: departmentToEdit.Department,
                clientId: departmentToEdit.clientId,
                id: departmentToEdit.id
            });
            onOpen();
        }
    };

    const renderCell = (dep: DepartmentData, columnKey: keyof DepartmentData | 'actions') => {
        if (columnKey === 'actions') {
            return (
                <div className="flex justify-center items-center gap-2">
                    <Tooltip content={t('Edit Department')}>
                        <button aria-label={t('Edit Department')} onClick={() => handleEdit(dep.id)}>
                            <EditIcon />
                        </button>
                    </Tooltip>
                    <Tooltip content={t('Delete Department')} color="danger">
                        <button aria-label={t('Delete Department')} onClick={() => handleDelete(dep.id)}>
                            <DeleteIcon />
                        </button>
                    </Tooltip>
                </div>
            );
        }
        return <span>{dep[columnKey as keyof DepartmentData]}</span>;
    };

    const columns = [
        { name: t('Department'), uid: 'Department' },
        { name: t('Actions'), uid: 'actions' }
    ];

    return (
        <DefaultLayout>
            <div className='container'>
                <div className="flex mb-4">
                    <Button onPress={onOpen} color="primary">{t('Add Department')}</Button>
                </div>
                <Card>
                    <p className="text-2xl text-center font-bold">{t('Departments')}</p>
                    <Spacer y={2} />

                    <Table aria-label={t('Uploaded Departments')} style={{ height: 'auto', minWidth: '100%', fontSize: "18pt", fontWeight: "bold" }}>
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={departments}>
                            {(item) => (
                                <TableRow key={item.id}>
                                    {(columnKey) => (
                                        <TableCell>
                                            {renderCell(item, columnKey as keyof DepartmentData | 'actions')}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>

            {/* Modal for adding or editing department */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('Add/Edit Department')}</ModalHeader>
                            <ModalBody>
                                <Input
                                    name="Department"
                                    label={t('Department')}
                                    value={formData.Department}
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

export default Department;
