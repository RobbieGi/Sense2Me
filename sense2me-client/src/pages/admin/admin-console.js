import React, {useEffect, useState} from "react";

//css
import "./admin-console.css";

//NavBar
import NavBar from "../../components/NavBar";

//Admin Componenets
import AddProduct from "../../components/admin/AddProduct";
import CreateAdmin from "../../components/admin/CreateAdmin";
import UpdateProduct from "../../components/admin/UpdateProduct";
import CreateOrder from "../../components/admin/CreateOrder";
import ViewCustomers from "../../components/admin/viewCustomers";
import DeleteProduct from "../../components/admin/DeleteProducts";
import ChangeDetails from "../../components/Users/changeDetails";

function AdminConsole(){

    useEffect(() => {
        console.log(sessionStorage.getItem('isAdmin'))
        if(sessionStorage.getItem('isAdmin') === 'false' && sessionStorage.getItem('isAuth') === 'true'){
            console.log("NOT ADMIN!!!")
            window.location.href = '/shop';
        }
        if(sessionStorage.getItem('isAdmin') === 'false' && sessionStorage.getItem('isAuth') === 'false'){
            console.log("NOT ADMIN!!!")
            window.location.href = '/login';
        }
    })

    const [currentComponent, setCurrentComponent] = useState('AddProduct');

    const renderComponent = () => {
        switch (currentComponent) {
          case "AddProduct":
            return <AddProduct />;
        case "CreateAdmin":
            return <CreateAdmin />;
        case "UpdateProduct":
            return <UpdateProduct />;
        case "CreateOrder":
            return <CreateOrder />;
        case "ViewCustomers":
            return <ViewCustomers />;
        case "DeleteProduct":
            return <DeleteProduct />;
        case "ChangeDetails":
            return <ChangeDetails />;
        }
    }

    return(
        <div className="AdminConsole">
            <NavBar/>
            <div className="sidebar">
                <h1 className="sidebar-margin-sml">Menu</h1>
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("CreateAdmin")}>Create Admin</h3> 
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("AddProduct")}>Add Product</h3>  
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("UpdateProduct")}>Update Product</h3>
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("DeleteProduct")}>Delete Product</h3>
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("ViewCustomers")}>View Customers</h3>  
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("CreateOrder")}>View Orders</h3>
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("ChangeDetails")}>Change Details</h3>
            </div>
            <div className="content-admin">
                {renderComponent()}
            </div>
        </div>
    );

}

export default AdminConsole;