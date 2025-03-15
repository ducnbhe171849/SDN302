import { ErrorElement, TinyMCEEditor } from "./components";
import {
  HomeLayout,
  Error,
  Login,
  Register,
  Department,
  CreateDepartment,
  DepartmentEmployees,
  EmployeeProfile,
  Employees,
  AddEmployee,
  CreateEmployee,
  EditEmployee,
  EditDepartment,
  EditSalary,
  AttendanceManager,
  DepartmentStatistic,
  EmployeeStatistic,
  Notification,
  NotificationList,
  Logs,
  MyProfile,
  SalaryHistory,
  ForgotPassword,
} from "./pages";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { loader as createDepartmentLoader } from "./pages/CreateDepartment";
import { loader as departmentLoader } from "./pages/Department";
import { loader as deEmployeeLoader } from "./pages/DepartmentEmployees";
import { loader as employeeProfileLoader } from "./pages/EmployeeProfile";
import { loader as createEmployeeLoader } from "./pages/CreateEmployee";
import { loader as employeeLoader } from "./pages/Employees";
import { loader as employeeUpdateLoader } from "./pages/EmployeeUpdate";
import { loader as departmentUpdateLoader } from "./pages/DepartmentUpdate";
import { loader as addEmployeeLoader } from "./pages/AddEmployee";
import { loader as salaryLoader } from "./pages/SalaryEdit";
import { loader as attendanceLoader } from "./pages/Attendance";
import { loader as attendManagerLoader } from "./pages/AttendanceManager";
import { loader as departmentStatisticLoader } from "./pages/DepartmentStatistic";
import { loader as employeeStatisticLoader } from "./pages/EmployeeStatistic";
import { loader as notificationLoader } from "./pages/Notification";
import { loader as listNotificationLoader } from "./pages/NotificationList";
import { loader as homeLayoutLoader } from "./pages/HomeLayout";
import { loader as logsLoader } from "./pages/Logs";
import { loader as myProfileLoader } from "./pages/MyProfile";
import { loader as salaryHistoryLoader } from "./pages/SalaryHistory";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as createDepartmentAction } from "./pages/CreateDepartment";
import { action as createEmployeeAction } from "./pages/CreateEmployee";
import { action as employeeUpdateAction } from "./pages/EmployeeUpdate";
import { action as salaryEditAction } from "./pages/SalaryEdit";

import { store } from "./store";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Attendance from "./pages/Attendance";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    loader: homeLayoutLoader(store),
    children: [
      // home
      {
        index: true,
        element: <Department></Department>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: departmentLoader(store),
      },
      {
        path: "/department/create",
        element: <CreateDepartment></CreateDepartment>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: createDepartmentLoader(store),
        action: createDepartmentAction(store),
      },
      {
        path: "/department/:id/employees",
        element: <DepartmentEmployees></DepartmentEmployees>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: deEmployeeLoader(store),
      },
      {
        path: "/employee/:id",
        element: <EmployeeProfile></EmployeeProfile>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: employeeProfileLoader(store),
      },
      {
        path: "/employee",
        element: <Employees></Employees>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: employeeLoader(store),
      },
      {
        path: "/department/:id/employees/add",
        element: <AddEmployee></AddEmployee>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: addEmployeeLoader(store),
      },
      {
        path: "/employee/create",
        element: <CreateEmployee></CreateEmployee>,
        errorElement: <ErrorElement></ErrorElement>,
        action: createEmployeeAction,
        loader: createEmployeeLoader(store),
      },
      {
        path: "/employee/edit/:id",
        element: <EditEmployee></EditEmployee>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: employeeUpdateLoader(store),
        action: employeeUpdateAction,
      },
      {
        path: "/department/update/:id",
        element: <EditDepartment></EditDepartment>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: departmentUpdateLoader(store),
      },

      {
        path: "/employee/salary/update/:id",
        element: <EditSalary></EditSalary>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: salaryLoader(store),
        action: salaryEditAction,
      },

      {
        path: "/attendance",
        element: <Attendance></Attendance>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: attendanceLoader(store),
      },

      {
        path: "/attendance/statistics",
        element: <AttendanceManager></AttendanceManager>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: attendManagerLoader(store),
      },

      {
        path: "/tiny",
        element: <TinyMCEEditor></TinyMCEEditor>,
        errorElement: <ErrorElement></ErrorElement>,
      },

      {
        path: "/department/statistic/:id",
        element: <DepartmentStatistic></DepartmentStatistic>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: departmentStatisticLoader(store),
      },

      {
        path: "/department/statistic/all",
        element: <EmployeeStatistic></EmployeeStatistic>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: employeeStatisticLoader(store),
      },

      {
        path: "/notification/create",
        element: <Notification></Notification>,
        loader: notificationLoader(store),
      },

      {
        path: "/notification",
        element: <NotificationList></NotificationList>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: listNotificationLoader(store),
      },

      {
        path: "/logs",
        element: <Logs></Logs>,
        errorElement: <ErrorElement></ErrorElement>,
        loader: logsLoader(store),
      },

      {
        path: "/myProfile",
        element: <MyProfile></MyProfile>,
        loader: myProfileLoader(store),
      },

      {
        path: "employee/:id/salary/history/",
        element: <SalaryHistory></SalaryHistory>,
        loader: salaryHistoryLoader(store),
      },

      // // products
      // {
      //   path: "products",
      //   element: <Products></Products>,
      //   loader: productsLoader(queryClient),
      // },

      // // single products
      // {
      //   path: "/products/:id",
      //   element: <SingleProduct></SingleProduct>,
      //   loader: singleLoader(queryClient),
      // },

      // // about
      // {
      //   path: "about",
      //   element: <About></About>,
      // },

      // // orders
      // {
      //   path: "orders",
      //   element: <Orders></Orders>,
      //   loader: orderLoader(store, queryClient),
      // },

      // // checkout
      // {
      //   path: "checkout",
      //   element: <Checkout></Checkout>,
      //   loader: checkoutLoader(store),
      //   action: checkoutAction(store, queryClient),
      // },

      // // cart
      // {
      //   path: "cart",
      //   element: <Cart></Cart>,
      // },
    ],
    errorElement: <Error></Error>,
  },

  {
    path: "login",
    element: <Login></Login>,
    errorElement: <Error></Error>,
    action: loginAction(store),
  },

  {
    path: "/reset/password",
    element: <Register></Register>,
    action: registerAction,
    errorElement: <Error></Error>,
  },

  {
    path: "/forgot/password",
    element: <ForgotPassword></ForgotPassword>,
    errorElement: <Error></Error>,
  },
]);

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
