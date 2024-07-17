import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { IoEye } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import Modal from './components/Modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from './components/Button';
import axios from 'axios';
import Toast from './components/Toast';

const initialValues = {
	name: "",
	emailId: "",
	contact: "",
  access: ""
};
interface selectedEmployee{
  id: number,
  name: "",
  emailId: "",
  contact: "",
  access: ""
}
interface employeeDetails{
  name: "",
  emailId: "",
  contact: "",
  access: ""
}

const contactRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/g;
const emailRegexp = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;

const userSchema = Yup.object().shape({
	name: Yup.string().required("This field is required"),
	emailId: Yup.string().required("This field is required").matches(emailRegexp, "Invalid email"),
	contact: Yup.string()
		.matches(contactRegExp, "Invalid Contact Number")
		.required("This field is required"),
	access: Yup.string().required("This field is required")
});

function App() {
  const [modal, setModal] = useState({
    showModal : false,
    type: ""
  })
  const [employees, setEmployees] = useState([]);
  const [toasts, setToasts] = useState({
    showToast: false,
    toastMessage: '',
  });
  const [employeeDetails, setemployeeDetails] = useState<employeeDetails>();
  const [selectedemployee, setSelectedEmployee] = useState<selectedEmployee>();
  const [reload, setReload] = useState(false);

  useEffect(()=>{
    fetch('http://127.0.0.1:8000/api/employees/')
    .then(response => response.json())
    .then(data => setEmployees(data))
    .catch(e => console.log(e))
  },[reload])

  const handleSubmit = (values: any) => {
    fetch('http://127.0.0.1:8000/api/employees/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    .then(response => response.json())
    .then(() => setReload(!reload)) 
    .catch(error => console.error('Error:', error));
    setModal({
      showModal: false,
      type: "add"
    })
    setToasts({
      showToast: true,
      toastMessage: 'Employee data created successfully'
    })
  }

  const handleView = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/employees/${id}/`)
    .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => setemployeeDetails(data))
  .catch(error => console.error('Error:', error));
  setModal({
    showModal: true,
    type: "view"
  })
  }

  const handleDelete = (id: number) => {
    fetch(`http://127.0.0.1:8000/api/employees/${id}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); 
      })
      .then(text => {
        return text ? JSON.parse(text) : {};
      })
      .then(() => setReload(!reload)) 
      .then(() => {
        setEmployees(employees => {
          return employees.filter((employee: { id: number }) => employee.id !== id);
        });
        setToasts({
          showToast: true,
          toastMessage: "Employee data deleted successfully"
        })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const handleEdit = (id: number) => {
    const employee = employees.find((employee: {id:number}) => employee.id === id);
    if(employee){
      setSelectedEmployee(employee);
      setModal({
        showModal: true,
        type: "edit"
      })
    }
  }

  const handleUpdateEmployee = (values: any, e: any) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:8000/api/employees/${selectedemployee?.id}/`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
    })
    .then(() => setReload(!reload)) 
    .catch(error => {
      console.error('Error:', error);
    });
    setModal({
      showModal: false,
      type: "add"
    })
  }

  function formatPhoneNumber(phoneNumberString: string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]})-${match[2]}-${match[3]}`;
    }
    return phoneNumberString;
  }
  

  return (
    <div className="App">
      <Header onModalClick={()=>setModal({
        showModal: true,
        type: "add"
      })}/>
      {employees.length === 0 ? 
      <h1 className='flex items-center justify-center'>No employees, create one</h1> :
      <>
      <Toast
        showToast={toasts.showToast}
        toastMessage={toasts.toastMessage}
        onClose={() => setToasts({ showToast: false,toastMessage: '' })}/>
      
      {(modal.type === "add" && modal.showModal === true) && 
      <Modal onRequestClose={()=>setModal({
        showModal: false,
        type: "add"
      })} title="Add a new employee">
      <Formik
      initialValues={initialValues}
      validationSchema={userSchema}
      onSubmit={handleSubmit}>
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <>
        <form onSubmit={handleSubmit} style={{marginTop: '30px'}}>
          <div className='text-black flex flex-row flex-wrap gap-6'>
            <div className='input'>
              <label>Name</label>
              <input
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              name="name"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.name && touched.name && errors.name}</p>
            </div>
            <div className='input'>
            <label>Email Id</label>
            <input
              id="email"
              value={values.emailId}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              name="emailId"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.emailId && touched.emailId && errors.emailId}</p>
            </div>
            <div className='input'>
            <label>Contact</label>
            <input
              id="contact"
              value={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              name="contact"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.contact && touched.contact && errors.contact}</p>
            </div>
            <div className='input'>
            <label>Application access type</label>
            <select name="access" id="access" value={values.access} onChange={handleChange} onBlur={handleBlur} className='text-xs mt-2 border border-gray-500 px-3 py-1.5 rounded-lg'>
              <option className='text-sm'>Select access type</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
            </select>
            <p className='text-xs text-red-600'>{errors.access && touched.access && errors.access}</p>
            </div>
            </div>
            <Button className='mt-5 bg-[#DC5F00] p-2 rounded-lg' onClick={handleSubmit}>
              <p className='text-xs text-white'>Submit</p>
            </Button>
        </form>
        </>
        )
      }
      </Formik>
    </Modal>
      }
      {(modal.type === "view" && modal.showModal === true) && 
      <Modal onRequestClose={()=>setModal({
        showModal: false,
        type: "view"
      })} title='Employee Details'>
      <div className='flex flex-col gap-5 items-start mt-4'>
        <div className='details'>
           <h1>Employee Name</h1>
           <h5 className='text-sm'>{employeeDetails?.name}</h5>
        </div>
        <div className='details'>
           <h1>Email Id</h1>
           <h5 className='text-sm'>{employeeDetails?.emailId}</h5>
        </div>
        <div className='details'>
           <h1>Contact Number</h1>
           <h5 className='text-sm'>{employeeDetails?.contact}</h5>
        </div>
        <div className='details'>
           <h1>Access type</h1>
           <h5 className='text-sm'>{employeeDetails?.access}</h5>
        </div>

      </div>
      </Modal>}
 
      {(modal.type==="edit" && modal.showModal === true && selectedemployee) && 
      <Modal onRequestClose={()=>setModal({
        showModal: false,
        type: "edit"
      })} title="Edit employee details">
      <Formik
      initialValues={{
        name: selectedemployee.name,
        emailId: selectedemployee.emailId,
        contact: selectedemployee.contact,
        access: selectedemployee.access
      }}
      validationSchema={userSchema}
      onSubmit={handleUpdateEmployee}>
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange
      }) => (
        <>
        <form onSubmit={(e)=>handleUpdateEmployee(values, e)} style={{marginTop: '30px'}}>
          <div className='text-black flex flex-row flex-wrap gap-6'>
            <div className='input'>
              <label>Name</label>
              <input
              id="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              name="name"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.name && touched.name && errors.name}</p>
            </div>
            <div className='input'>
            <label>Email Id</label>
            <input
              id="email"
              value={values.emailId}
              onChange={handleChange}
              onBlur={handleBlur}
              type="email"
              name="emailId"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.emailId && touched.emailId && errors.emailId}</p>
            </div>
            <div className='input'>
            <label>Contact</label>
            <input
              id="contact"
              value={values.contact}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              name="contact"
              className='px-2 py-1 mt-2 text-sm'
            />
            <p className='text-xs text-red-600'>{errors.contact && touched.contact && errors.contact}</p>
            </div>
            <div className='input'>
            <label>Application access type</label>
            <select name="access" id="access" value={values.access} onChange={handleChange} onBlur={handleBlur} className='text-xs mt-2 border border-gray-500 px-3 py-1.5 rounded-lg'>
              <option className='text-sm'>Select access type</option>
              <option value="user">user</option>
              <option value="admin">admin</option>
              <option value="manager">manager</option>
            </select>
            <p className='text-xs text-red-600'>{errors.access && touched.access && errors.access}</p>
            </div>
            </div>
            <Button className='mt-5 bg-[#DC5F00] p-2 rounded-lg' onClick={()=>handleUpdateEmployee}>
              <p className='text-xs text-white'>Submit</p>
            </Button>
        </form>
        </>
        )
      }
      </Formik>
    </Modal>
      }
      <table className='border border-collapse p-2 mx-10'>
        <thead className='border border-collapse  p-2 bg-[#686D76] text-white'>
          <tr>
            <th className='border border-collapse font-medium py-3 text-md'>Employee Id</th>
            <th className='border border-collapse font-medium text-md'>Name</th>
            <th className='border border-collapse font-medium text-md'>Email Id</th>
            <th className='border border-collapse font-medium text-md'>Phone</th>
            <th className='border border-collapse font-medium text-md'>Application access</th>
            <th className='border border-collapse font-medium text-md'>Actions</th>
          </tr>
        </thead>
        <tbody className='border border-collapse p-2'>
      {employees.map((employee: {id: number, name: string, emailId: string, contact: string, access: string}, index: number) => (
      <tr className='table-row' key={index}>
      <td className='border border-collapse p-3 text-[15px]'>{employee.id}</td>
      <td className='border border-collapse p-3 text-[15px]'>{employee.name}</td>
      <td className='border border-collapse p-3 text-[15px]'>{employee.emailId}</td>
      <td className='border border-collapse p-3 text-[15px]'>{formatPhoneNumber(employee.contact)}</td>
      <td className='border border-collapse p-3 text-[15px] text-center'>
        <div className='flex justify-center'>
          <p className={`w-fit p-1 px-2 rounded-md text-sm ${employee.access === "manager" ? "bg-green-300" : employee.access === "admin" ? "bg-purple-300" : "bg-blue-300"}`}>{employee.access}</p>
        </div>
      </td>
      <td className='border border-collapse p-3'>
        <div className='flex flex-row items-center justify-center gap-3'>
          <IoEye size={22} color='green' className='mx-3' onClick={()=>handleView(employee.id)}/>
          <MdOutlineEdit size={22} color='blue' className='mx-3' onClick={()=>handleEdit(employee.id)}/>
          <MdDelete size={22} color='red' className='mx-3' onClick={()=>handleDelete(employee.id)}/>
        </div> 
      </td>
    </tr>
    
    ))}
    </tbody>
      </table>
      </>}
    </div>
  );
}

export default App;
