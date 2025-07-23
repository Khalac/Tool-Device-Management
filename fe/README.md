# Tool Device Management - Frontend

A modern web application for managing assets, users, departments, and maintenance in your organization. Built with React, TypeScript, and Vite for a fast, scalable, and maintainable experience.

## 🌟 Features

- **Authentication & Authorization**: Register, forgot password, secure login and role-based access control.
- **Dashboard**: Overview of asset statistics, recent purchased devices, and quick insights.
- **Asset Management**: View, create, update, and filter assets with categories, departments, and statuses.
- **Assignment Management**: Assign assets to users and track assignment history.
- **Transfer Requests**: Create and manage asset transfer requests between departments.
- **User Management**: Assign roles to users.
- **Department Management**: Organize users and assets by department.
- **Maintenance Scheduling**: Plan and track maintenance schedules for assets.
- **Notifications**: Receive realtime update notifications on assignments, transfers, and maintenance.
- **Export Functionality**: Users can export asset reports and data in multiple formats such as PDF, CSV, and HTML files.
- **Dark Mode Support**: Users can switch between light and dark themes for better usability.
- **User Profile Management**: Users can update personal information including uploading avatar and modifying details.
- **Asset Comparison**: Compare multiple assets within the same category.
- **Statistical Reports**: Admins can view detailed reports filtered by month and year, and compare data between months.
- **Billing System**: Admins can create bills after assets are created, view bill details, and print bills.

## 🚀 Tech Stack

- [React] + [TypeScript]
- [Vite] for fast development
- [Redux Toolkit] [Redux Thunk] for state management
- [Zod] [React Hook Form] for form and validation
- [Tailwind CSS] for styling
- [Shadcn] for UI components

## 📦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) to view the app.

## 🌐 Production

You can access the live application here:

[Production Website](https://tool-device-management.vercel.app/)

## 🧑‍💻 For Developers

- Code is organized by feature in `src/features/` for scalability.
- Reusable UI components are located in `src/components/ui/`.
- API calls and models are separated for clarity.
- ESLint and Prettier are configured for code quality.

## 📁 Project Structure

```
fe/
  src/
    features/        # Feature modules (assets, user, assignments, ...)
    components/      # Reusable UI components
    hooks/           # Custom React hooks
    lib/             # Utilities and HTTP client
    pages/           # Page components
    redux-store/     # Redux store setup
    router/          # App routing
    utils/           # Helper functions
  public/            # Static assets
  ...
```

## 📜 Future Improvements

- **Add new information such as performance, chip, RAM,.. to enable more detailed comparison between assets.**
- **Manage the remaining quantity of assets in stock.**
- **Payment Processing: Enable payment functionalities for bills.**
- **Depreciation Management**
- **Role receive Notifications**
