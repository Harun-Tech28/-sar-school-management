# SAR Educational Complex - School Management System

A comprehensive school management system built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

### Core Modules
- **Student Management** - Enrollment, profiles, attendance tracking
- **Teacher Management** - Staff profiles, class assignments
- **Parent Portal** - View student progress, reports, fees
- **Attendance System** - Daily tracking with analytics
- **Grade Management** - Exams, report cards, rankings
- **Financial Management** - Income, expenses, budgets, salaries
- **Announcements** - School-wide communication
- **Report Cases** - Issue reporting and tracking
- **Academic Calendar** - Events and holidays

### User Roles
- **Admin** - Full system access and management
- **Teacher** - Class management, grading, attendance
- **Parent** - View student information and progress
- **Student** - View grades, attendance, announcements

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom session-based auth
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd SAR_EDU
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sar_edu"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Set up the database
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Create an admin user
```bash
npm run create-admin
```

6. Start the development server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Production Deployment

### Build
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Deploy to Railway/Render
1. Push code to GitHub
2. Create new project
3. Add PostgreSQL database
4. Add environment variables
5. Deploy

## Project Structure

```
SAR_EDU/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages (admin, teacher, parent, student)
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── ...
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   ├── session.ts        # Session management
│   └── ...
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Migration files
├── public/               # Static files
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run create-admin` - Create admin user
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create new migration

## Key Features

### Authentication
- Role-based access control (Admin, Teacher, Parent, Student)
- Self-registration with admin approval
- Password reset functionality
- Secure session management

### Student Management
- Complete student profiles
- Admission tracking (new/continuing students)
- Class assignments
- Parent linking

### Academic Features
- Attendance tracking with analytics
- Grade management and report cards
- Exam scheduling and results
- Homework assignments
- Performance analytics

### Financial Management
- Income and expense tracking
- Budget management with alerts
- Salary processing
- Fee management
- Financial reports (income statement, balance sheet, cash flow)

### Communication
- School-wide announcements
- Report case system
- Parent-teacher communication

## Database Schema

The system uses PostgreSQL with Prisma ORM. Key models include:
- User, Student, Teacher, Parent, Admin
- Class, Attendance, Grade, Exam
- Income, Expense, Budget, Salary
- Announcement, Report
- And more...

See `prisma/schema.prisma` for complete schema.

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

## Contributing

This is a school management system project. For contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions:
- Check the `/docs` folder for detailed documentation
- Review the Prisma schema for database structure
- Check API routes in `/app/api` for backend logic

## Acknowledgments

Built for SAR Educational Complex to streamline school management operations.

---

**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: November 2025
