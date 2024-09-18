import { FC, useState } from 'react';
import { Input, Button, Spacer, Card } from '@nextui-org/react';
import { db } from '@/config/firebase'; // Adjust the path as necessary
import { collection, addDoc } from 'firebase/firestore';
import DefaultLayout from '@/layouts/default';
const ClassAdd: FC = () => {
    const clientId = localStorage.getItem("clientId");
    const [formData, setFormData] = useState({
        Department: '',
        ClassName: '',
        clientId: clientId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                clientId: clientId,
            });
        } catch (e) {
            alert('Error adding document: ' + e);
        }
    };

    return (
        <DefaultLayout>
            <Card style={{ padding: "$6", maxWidth: "600px", margin: "auto", }} className='container px-4 py-4'>
                <p className="text-3xl text-center justify-center font-bold">Department &class add Form</p>
                <Spacer y={5} />

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                size="lg"
                                label="Department"
                                name="Department"
                                value={formData.Department}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                size="lg"
                                label="Class Name"
                                name="ClassName"
                                value={formData.ClassName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <Spacer y={2} />
                    <Button size="lg" color="primary" type="submit">Submit</Button>
                </form>
            </Card>
        </DefaultLayout>

    );
};

export default ClassAdd;
