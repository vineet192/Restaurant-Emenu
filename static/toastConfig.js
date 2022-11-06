import { toast } from 'react-toastify';

let successToast = (msg) =>
  toast.success(msg, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });

let errorToast = (msg) =>
  toast.error(msg, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });

let neutralToast = (msg) =>
  toast(msg, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
  });
  
export { successToast, errorToast, neutralToast };
