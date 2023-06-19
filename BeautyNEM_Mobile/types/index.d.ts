declare module "*.jpg" {
    const path: string;
    export default path;
}

declare module "*.png" {
    const path: string;
    export default path;
}

declare module "react-native-vector-icons/MaterialIcons";
declare module "react-native-vector-icons/Ionicons";
declare module "formik";
declare module "yup";
declare module 'react-native-element-dropdown';
declare module 'react-native-vector-icons/AntDesign';
declare module '@env' {
    export const REACT_APP_DOMAIN_API: string;
}