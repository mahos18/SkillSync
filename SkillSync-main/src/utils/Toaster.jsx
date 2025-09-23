import toast, { Toaster } from 'react-hot-toast';


export const handleSuccess=(msg)=>{
toast(msg, {
  duration: 4000,
  position: 'top-center',
  // Custom Icon
  icon: '✅',
  iconTheme: {
    primary: '#ffffffff',
    secondary: '#e92c2cff',
  },

  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
  removeDelay: 1000,
  toasterId: 'default',
});
}

export const handleError=(msg)=>{
toast(msg, {
  duration: 4000,
  position: 'top-center',
  // Custom Icon
  icon: '❌',
  iconTheme: {
    primary: '#ffffffff',
    secondary: '#e92c2cff',
  },

  ariaProps: {
    role: 'status',
    'aria-live': 'polite',
  },
  removeDelay: 1000,
  toasterId: 'default',
});
}

