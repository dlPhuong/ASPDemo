import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from "react-redux";
import { retrievePeople,updatePeople,createPeople,deletePeople} from "../../actions/people-action";
import peopleService from "../../services/peopleService";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

const People = (props) => {
  const dispatch = useDispatch();

  let emptyProduct = {
    Name: '',
    Age: '',
};

const [products, setProducts] = useState(null);
const [productDialog, setProductDialog] = useState(false);
const [deleteProductDialog, setDeleteProductDialog] = useState(false);
const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
const [product, setProduct] = useState(emptyProduct);
const [selectedProducts, setSelectedProducts] = useState(null);
const [submitted, setSubmitted] = useState(false);
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);


const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
}

const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
}

const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
}

const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
}

const saveProduct = () => {
    setSubmitted(true);

    if (product.Name.trim()) {
        let _products = [...products];
        let _product = {...product};
        if (product.Id) {

            const index = findIndexById(product.id);
            _products[index] = _product;
            updatePeople1(_product)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        else {
            // _product.id = createId();
            // _product.image = 'product-placeholder.svg';
            _products.push(_product);
            addPeople1(_product)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }

        setProducts(_products);
        setProductDialog(false);
        setProduct(emptyProduct);
    }
}

const editProduct = (product) => {
    setProduct({...product});
    setProductDialog(true);
}

const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
    deletePeople1(product.Id)
}

const deleteProduct = () => {
    let _products = products.filter(val => val.id !== product.id);
    setProduct(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
}

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

const exportCSV = () => {
    dt.current.exportCSV();
}

const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
}

const deleteSelectedProducts = () => {
  console.log(selectedProducts)
  deletePeople1(selectedProducts[0].Id)

    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
}


const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = {...product};
    _product[`${name}`] = val;

    setProduct(_product);
}


const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <Button label="New" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
        </React.Fragment>
    )
}

const rightToolbarTemplate = () => {
    return (
        <React.Fragment>
            <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="p-mr-2 p-d-inline-block" />
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </React.Fragment>
    )
}

const actionBodyTemplate = (rowData) => {
    return (
        <React.Fragment>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
        </React.Fragment>
    );
}

const header = (
    <div className="table-header">
        <h5 className="p-m-0">Manage Products</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);
const productDialogFooter = (
    <React.Fragment>
        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
);
const deleteProductDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
    </React.Fragment>
);
const deleteProductsDialogFooter = (
    <React.Fragment>
        <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
        <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
    </React.Fragment>
);

const updatePeople1=(data)=>{
  console.log(data)
  dispatch(updatePeople(data))
  .then(response => {
  })
  .catch(e => {
    console.log(e);
  });
}

const addPeople1=(data)=>{
  console.log(data)
  dispatch(createPeople(data))
  .then(response => {
    const products = product.push(data)
    setProduct(products)
  })
  .catch(e => {
    console.log(e);
  });
}

const deletePeople1=(id)=>{
  dispatch(deletePeople(id))
  .then(response => {
    let _products = products.filter(val => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
  })
  .catch(e => {
    console.log(e);
  });
}

const getProduct=()=>{
  dispatch(retrievePeople())
  .then(response => {
    console.log(response)
    setProducts(response)
  })
  .catch(e => {
    console.log(e);
  });
}

useEffect(() => {
  getProduct();
}, []);

  return (
    <div className="datatable-crud-demo">
    <Toast ref={toast} />
      <div className="card">

      <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable 
        value={products} 
        dataKey="Id" 
        selection={selectedProducts} 
        onSelectionChange={(e) => setSelectedProducts(e.value)} 
        globalFilter={globalFilter}
        header={header}
        >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="Id" header="id"></Column>
          <Column field="Name" header="Name"></Column>
          <Column field="Age" header="Age"></Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    
      <Dialog visible={productDialog} style={{ width: '450px' }} header="people product" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>

                <div className="p-field">
                    <label htmlFor="Name">Name</label>
                    <InputText id="Name" value={product.Name} onChange={(e) => onInputChange(e, 'Name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>

                <div className="p-field">
                    <label htmlFor="Age">Age</label>
                    <InputText id="Age" value={product.Age} onChange={(e) => onInputChange(e, 'Age')} required rows={3} cols={20} />
                </div>

            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
    </div>
  );
};

export default People;
