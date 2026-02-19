# Dawat Restaurant Admin Dashboard

A modern, full-featured admin dashboard for managing restaurant tours, bookings, and operations. Built with Next.js, React, and Tailwind CSS.

## Features

### 📊 Dashboard
- Real-time statistics cards (Bookings, Income, Requests, Clients)
- Interactive charts using Recharts
- Bar charts for tours created
- Line charts for booking trends
- Recent bookings table with status indicators

### 🎫 Tours Management
- Create, read, update, and delete tours
- Track tour capacity and bookings
- Manage tour guides and dates
- Display pricing and availability

### 📅 Bookings Management
- Full booking management system
- Guest information tracking
- Booking status (Confirmed, Pending, Cancelled)
- Special notes and requirements
- Real-time booking updates

### 💬 Contact Requests
- Manage customer inquiries
- Track request status (New, Replied, Resolved)
- Reply to customer messages
- Priority management and filtering
- Contact information tracking

### 📢 Notices
- Post important announcements
- Priority levels (High, Medium, Low)
- Author tracking
- Beautiful card-based layout
- Date-stamped notifications

### ⚙️ Settings
- Restaurant information management
- Currency and language selection
- Timezone configuration
- Password management
- System information display
- Secure data management

### 🔐 Authentication
- Secure login system
- Session management
- Protected dashboard routes
- Demo credentials support

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Language**: TypeScript
- **State Management**: React Hooks
- **Icons**: SVG Components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository or download the project
2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

## Project Structure

```
app/
├── page.tsx                 # Root page (redirects to login/dashboard)
├── layout.tsx              # Root layout with metadata
├── globals.css             # Global styles and color tokens
├── login/
│   └── page.tsx            # Login page
├── dashboard/
│   ├── layout.tsx          # Protected dashboard layout
│   └── page.tsx            # Main dashboard with stats and charts
├── tours/
│   └── page.tsx            # Tours management page
├── bookings/
│   └── page.tsx            # Bookings management page
├── contact-requests/
│   └── page.tsx            # Contact requests management
├── notices/
│   └── page.tsx            # Notices and announcements
└── settings/
    └── page.tsx            # Settings and configuration

components/
├── sidebar.tsx             # Navigation sidebar
├── stat-card.tsx           # Reusable stat card component
└── ui/                     # shadcn/ui components

public/
└── logo.png               # Dawat Restaurant logo
```

## Color Scheme

- **Primary**: Blue (#0052cc)
- **Secondary**: Orange (#ff6b35) - for accent elements
- **Success**: Green (#22c55e)
- **Warning**: Yellow
- **Danger**: Red (#ff4444)
- **Background**: White (#ffffff)
- **Sidebar**: Dark Gray (#1a1a1a)

## Key Features by Page

### Login Page
- Clean, centered form design
- Email and password validation
- Show/hide password toggle
- Error message display
- Demo credentials hint

### Dashboard
- 4 key metric cards with trend indicators
- 2 interactive charts (Bar and Line)
- Recent bookings table
- Real-time statistics

### Tours Page
- Complete CRUD operations
- Capacity tracking
- Guide assignment
- Price management
- Modal-based form

### Bookings Page
- Guest information management
- Status tracking (Confirmed/Pending/Cancelled)
- Special notes field
- Email and phone tracking
- Full CRUD operations

### Contact Requests
- Request tracking and categorization
- Status management (New/Replied/Resolved)
- Reply functionality
- Summary statistics
- Message viewing

### Notices
- Priority-based color coding
- Author and date tracking
- Full CRUD operations
- Prominent display for important announcements

### Settings
- Restaurant information management
- Password change functionality
- System information display
- Localization options (Language, Timezone, Currency)
- Data management tools

## Styling and Design

The dashboard uses a modern design system with:
- Clean, minimalist layout
- Responsive design (mobile-first)
- Shadow and rounded corners for depth
- Consistent spacing using Tailwind utilities
- Blue primary color scheme matching brand identity
- Accessible form elements and interactions

## localStorage Usage

The application uses browser localStorage for:
- User authentication status (`isLoggedIn`)
- User email storage (`userEmail`)
- Restaurant settings (`restaurantSettings`)

*Note: For production, implement proper backend authentication and database.*

## Data Management

Currently, all data is managed in component state using React hooks. For production deployment:

1. Implement a backend API with:
   - Express.js or similar
   - Database (PostgreSQL, MongoDB, etc.)
   - Proper authentication (JWT, OAuth)
   - API endpoints for all resources

2. Update components to use:
   - API calls instead of state management
   - SWR or React Query for data fetching
   - Proper error handling and loading states

## Responsive Design

The dashboard is fully responsive:
- **Mobile**: Single column layout, collapsible sidebar
- **Tablet**: 2 column grids, optimized spacing
- **Desktop**: Full layout with 4 column grids, expanded sidebar

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- Real database connectivity
- Email notifications
- SMS alerts for bookings
- PDF report generation
- Analytics and insights
- Multi-language support
- Dark mode toggle
- Advanced filtering and search
- Export to Excel/CSV

## Deployment

### Vercel Deployment (Recommended)
```bash
npm run build
# Vercel will automatically deploy
```

### Other Platforms
1. Build the project:
```bash
npm run build
```

2. Deploy the `.next` folder to your hosting platform

## Troubleshooting

### Login Not Working
- Clear browser cache and localStorage
- Check demo credentials
- Verify browser console for errors

### Styling Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Clear Tailwind cache

### Charts Not Displaying
- Verify Recharts is installed
- Check browser console for errors
- Ensure data format matches chart requirements

## License

This project is proprietary and intended for Dawat Restaurant use.

## Support

For issues, feature requests, or questions, please contact the development team.

## Changelog

### Version 1.0.0
- Initial release
- Complete admin dashboard
- All CRUD operations
- Responsive design
- Modern UI with Tailwind CSS
