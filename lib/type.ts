export interface User {
  id: string;
  name: string;
  nidNumber: string;
  phoneNumber: string;
  email: string;
  bloodGroup: string;
  city: string;
  region: string;
  village: string;
  dateOfLastDonation:string;
  numberOfTimes:string;
  studyDepartment:string;
  semester:string;
  session:string;
  rollNumber:string;
  regiNumber:string;
  policeStation:string;
  PreviousDonation:string;
  todaysDate:Date;
  availableDonar:string;
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phoneNumber?: string; 
  createdAt?: Date;  
  superAdmin?: boolean;
}
