import React, {useState} from "react";

//css
import "./admin-console.css";

//NavBar
import NavBar from "../../components/NavBar";

//Admin Componenets
import AddProduct from "../../components/admin/AddProduct";
import CreateUser from "../../components/admin/CreateUser";
import UpdateProduct from "../../components/admin/UpdateProduct";

function AdminConsole(){

    const [currentComponent, setCurrentComponent] = useState('CreateUser');

    const renderComponent = () => {
        switch (currentComponent) {
          case "AddProduct":
            return <AddProduct />;
        case "CreateUser":
            return <CreateUser />;
        case "UpdateProduct":
            return <UpdateProduct />;
        }
    }

    return(
        <div className="AdminConsole">
            <NavBar />
            <div className="sidebar">
                <h1 className="sidebar-margin-sml">Menu</h1>
                <h3 className="sidebar-margin-lrg sidebar-btn CreateUser" onClick={() => setCurrentComponent("CreateUser")}>Create Admin</h3> 
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("AddProduct")}>Add Product</h3>  
                <h3 className="sidebar-margin-lrg sidebar-btn" onClick={() => setCurrentComponent("UpdateProduct")}>Update Product</h3>
                <h3 className="sidebar-margin-lrg sidebar-btn">Delete Product</h3> 
                <h3 className="sidebar-margin-lrg sidebar-btn">View Customers</h3>  
                <h3 className="sidebar-margin-lrg sidebar-btn">View Orders</h3>
            </div>
            <div className="content-admin">
                {renderComponent()}
            </div>
        </div>
    );

}

export default AdminConsole;