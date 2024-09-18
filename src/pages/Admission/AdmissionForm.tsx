import { FC, useState, useEffect } from 'react';
import { Input, Button, Card, Spacer, Select, SelectItem } from '@nextui-org/react';
import { db } from '@/config/firebase'; // Adjust the path as necessary
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import DefaultLayout from '@/layouts/default';

const AdmissionForm: FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    class: '',
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [classes, setClasses] = useState<{ [key: string]: string[] }>({});
  const [filteredClasses, setFilteredClasses] = useState<string[]>([]);

  // Fetch all departments and classes based on clientId stored in localStorage
  useEffect(() => {
    const fetchDepartmentsAndClasses = async () => {
      try {
        const clientId = localStorage.getItem("clientId")?.toString(); // Get clientId from localStorage
        if (!clientId) {
          console.error('Client ID is not defined in local storage.');
          return;
        }

        // Query to fetch classes associated with the clientId
        const q = query(collection(db, 'class'), where('clientId', '==', clientId));
        const snapshot = await getDocs(q);

        const departmentsData: Set<string> = new Set();
        const classesData: { [key: string]: string[] } = {};

        snapshot.docs.forEach(doc => {
          const data = doc.data();
          const department = data.Department as string;
          const className = data.ClassName as string;

          // Store departments and their corresponding classes
          departmentsData.add(department);
          if (!classesData[department]) {
            classesData[department] = [];
          }
          classesData[department].push(className);
        });

        setDepartments(Array.from(departmentsData));
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching departments and classes:', error);
      }
    };

    fetchDepartmentsAndClasses();
  }, []);

  // Update filtered classes whenever the selected department changes
  useEffect(() => {
    if (formData.department && classes[formData.department]) {
      setFilteredClasses(classes[formData.department]);
    } else {
      setFilteredClasses([]);
    }
  }, [formData.department, classes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'admissions'), formData);
      alert('Form submitted successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        class: '',
      });
    } catch (e) {
      alert('Error adding document: ' + e);
    }
  };

  return (
    <DefaultLayout>
      <Card style={{ padding: "$6", maxWidth: "600px", margin: "auto" }}>
        <p className="text-3xl text-center justify-center font-bold">Student Admission Form</p>
        <Spacer y={5} />
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input size="lg" label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input size="lg" label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input size="lg" label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <Input size="lg" label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Input size="lg" label="Address" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Select size="lg" label="Select Department" name="department" value={formData.department} onChange={handleChange}>
                {departments.map(department => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Select size="lg" label="Select Class" name="class" value={formData.class} onChange={handleChange} isDisabled={!formData.department}>
                {filteredClasses.map(className => (
                  <SelectItem key={className} value={className}>
                    {className}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <Spacer y={2} />
          <Button size="lg" type="submit">Submit</Button>
        </form>
      </Card>
    </DefaultLayout>
  );
};

export default AdmissionForm;
