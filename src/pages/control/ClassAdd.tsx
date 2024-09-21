import { FC, useState, useEffect } from 'react';
import { Input, Button, Spacer, Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from '@nextui-org/react';
import { db } from '@/config/firebase'; // Adjust the path as necessary
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// import { EditIcon, DeleteIcon } from '@/components/icons'; // Replace with actual icon imports
import DefaultLayout from '@/layouts/default';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook

// Define an interface for the class data
interface ClassData {
    id: string;
    Department: string;
    ClassName: string;
    clientId: string | null; // Ensure clientId is included
}

const ClassAdd: FC = () => {
    const [formData, setFormData] = useState<ClassData>({
        Department: '',
        ClassName: '',
        clientId: localStorage.getItem('clientId'), // Get clientId from localStorage
        id: '' // We'll use this for editing (if needed)
    });

    const [classes, setClasses] = useState<ClassData[]>([]); // Explicitly type the classes state
    const [departments, setDepartments] = useState<string[]>([]); // State to hold department names
    const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]); // State to hold filtered classes
    const [sectionData, setSectionData] = useState({ Department: '', ClassName: '', SectionName: '' }); // Section form data
    const { t } = useTranslation(); // Initialize useTranslation hook
    const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Modal control
    const { isOpen: isSectionOpen, onOpen: onSectionOpen, onOpenChange: onSectionOpenChange } = useDisclosure(); // Section modal control

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
        } catch (e) {
            console.error('Error fetching classes:', e);
            alert('Failed to fetch classes. Please check your Firestore configuration.');
        }
    };

    // Fetch the list of departments from Firestore
    const fetchDepartments = async () => {
        try {
            const storedClientId = localStorage.getItem('clientId');

            if (!storedClientId) {
                alert(t('client_id_not_found'));
                return;
            }

            // Query to filter departments by clientId
            const departmentsCollection = query(
                collection(db, 'Department'), // Assuming the collection name is 'Department'
                where('clientId', '==', storedClientId)
            );

            const querySnapshot = await getDocs(departmentsCollection);
            const fetchedDepartments: string[] = querySnapshot.docs.map(doc => doc.data().Department); // Fetch department names

            setDepartments(fetchedDepartments); // Set the fetched department names in state
        } catch (e) {
            console.error('Error fetching departments:', e);
            alert('Failed to fetch departments. Please check your Firestore configuration.');
        }
    };

    // Fetch classes and departments on component mount
    useEffect(() => {
        fetchDepartments(); // Fetch departments
        fetchClassesAndDepartments(); // Fetch classes
    }, []);

    // Handle department change for the section modal, filter classes
    const handleDepartmentChangeForSection = (value: string) => {
        setSectionData((prev) => ({ ...prev, Department: value }));
        const filtered = classes.filter(cls => cls.Department === value);
        setFilteredClasses(filtered);
    };

    const handleSectionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSectionData({
            ...sectionData,
            [name]: value
        });
    };

    const handleSectionSubmit = async () => {
        if (sectionData.Department && sectionData.ClassName && sectionData.SectionName) {
            try {
                // Create a new class document with the section name in the class collection
                await addDoc(collection(db, 'class'), {
                    Department: sectionData.Department,
                    ClassName: sectionData.ClassName,
                    SectionName: sectionData.SectionName,
                    clientId: localStorage.getItem('clientId')
                });

                alert('Section added successfully!');
                onSectionOpenChange(); // Close the modal
                setSectionData({ Department: '', ClassName: '', SectionName: '' }); // Reset form
                fetchClassesAndDepartments(); // Refresh classes list
            } catch (e) {
                alert('Error adding section: ' + e);
            }
        } else {
            alert('Please fill out all fields.');
        }
    };

    // Other form submission and delete handlers remain unchanged

    return (
        <DefaultLayout>
            <div className='container'>
                <div className="flex mb-4 gap-4">
                    <Button onPress={onOpen} color="primary">{t('Add Class')}</Button>
                    <Button onPress={onSectionOpen} color="primary">{t('Add Section')}</Button> {/* Button to add section */}
                </div>
                <Card>
                    <p className="text-2xl text-center font-bold">{t('Departments & Classes')}</p>
                    <Spacer y={2} />

                    <Table aria-label={t('Uploaded Classes')} style={{ height: 'auto', minWidth: '100%', fontSize: "18pt", fontWeight: "bold" }}>
                        <TableHeader columns={[
                            { name: t('Department'), uid: 'Department' },
                            { name: t('Class Name'), uid: 'ClassName' },
                            { name: t('Actions'), uid: 'actions' }
                        ]}>
                            {(column) => (
                                <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody items={classes}>
                            {(item) => (
                                <TableRow key={item.id} className='font-semibold text-base'>
                                    {(columnKey) => (
                                        <TableCell>
                                            {item[columnKey as keyof ClassData]}
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
                                    onChange={handleSectionFormChange}
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
                                    onChange={handleSectionFormChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={onClose}>
                                    {t('Close')}
                                </Button>
                                <Button color="primary" onClick={handleSectionSubmit}>
                                    {t('Submit')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Modal for adding section */}
            <Modal isOpen={isSectionOpen} onOpenChange={onSectionOpenChange} placement="top-center">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('Add Section')}</ModalHeader>
                            <ModalBody>
                                <Select
                                    name="Department"
                                    label={t('Department')}
                                    value={sectionData.Department}
                                    placeholder={t('Select Department')}
                                    onChange={(e) => handleDepartmentChangeForSection(e.target.value)}
                                    className="w-full rounded-md p-2 mb-4"
                                >
                                    {departments.map((dept, index) => (
                                        <SelectItem key={index} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    name="ClassName"
                                    label={t('Class Name')}
                                    value={sectionData.ClassName}
                                    placeholder={t('Select Class')}
                                    onChange={handleSectionFormChange}
                                    className="w-full rounded-md p-2 mb-4"
                                >
                                    {filteredClasses.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.ClassName}>
                                            {cls.ClassName}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Input
                                    label={t('Section Name')}
                                    name="SectionName"
                                    placeholder={t('Enter Section Name')}
                                    value={sectionData.SectionName}
                                    onChange={handleSectionFormChange}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="flat" onClick={onClose}>
                                    {t('Close')}
                                </Button>
                                <Button color="primary" onClick={handleSectionSubmit}>
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
