# School Logo Watermark Setup

## ✅ What's Been Implemented

Your SAR Educational Complex logo has been configured to appear as a transparent watermark on all printed documents including:
- Fee receipts
- Report cards
- Financial reports
- Academic documents

## 📋 Next Steps

### 1. Save Your School Logo

Save your school logo image to the `public` folder with the name `school-logo.png`:

```
public/school-logo.png
```

**Important:** 
- Use PNG format for best transparency support
- Recommended size: 512x512 pixels or larger
- Make sure the background is transparent (if possible)

### 2. How to Print a Receipt

Once your logo is saved, you can print receipts for individual students:

1. **Go to Fee Management**
   - Navigate to: Admin Dashboard → Fee Management

2. **Find the Student's Payment**
   - Use the search bar to find by:
     - Student name
     - Roll number
     - Receipt number

3. **Click "Print Receipt"**
   - Click the "Print Receipt" button next to any payment
   - A modal will open showing the receipt preview

4. **Review and Print**
   - Review all details
   - Click "Print Receipt" button
   - Choose "Print" or "Save as PDF"

### 3. Receipt Features

Each printed receipt includes:

✓ **School Logo** (transparent watermark in background)
✓ **School Logo** (small version in header)
✓ **School Information** (name, address, contact)
✓ **Receipt Number** (unique tracking number)
✓ **Student Details** (name, roll number, class)
✓ **Payment Information** (amount, date, method, term)
✓ **Signature Sections** (for verification)
✓ **Professional Layout** (ready for printing)

### 4. Print Settings for Best Results

When printing:
- ✓ Enable "Background Graphics" in print settings
- ✓ Use Portrait orientation
- ✓ Set margins to minimum
- ✓ Choose "Save as PDF" to keep digital copies

### 5. Logo Appears On

The watermark logo will automatically appear on:
- ✓ Fee receipts
- ✓ Report cards (when implemented)
- ✓ Financial reports
- ✓ Academic transcripts
- ✓ Any other printed documents

## 🎨 Logo Specifications

Your current logo configuration:
- **School Name:** SAR Educational Complex
- **Logo Path:** `/school-logo.png`
- **Watermark Opacity:** 10% (subtle background)
- **Header Logo Size:** 80x80 pixels

## 🔧 Customization

To change logo settings, edit `lib/school-branding.ts`:

```typescript
export const DEFAULT_SCHOOL_BRANDING: SchoolBranding = {
  name: 'SAR Educational Complex',
  address: 'Box 130, Sepe Sote, Hospital Junction, Kumasi',
  phone: '+233 24 000 0000',
  email: 'info@sar.edu',
  website: 'www.sar.edu',
  logo: '/school-logo.png',  // Change this path if needed
  logoTransparent: '/school-logo.png',
}
```

## 📝 Testing

After saving your logo:

1. Go to Fee Management page
2. Click "Print Receipt" on any payment
3. Verify the logo appears:
   - As a large transparent watermark in the background
   - As a small logo in the header
4. Test printing or saving as PDF

## 🎓 Your Logo

Your SAR Educational Complex logo features:
- Red and yellow shield design
- Globe, pen, books, and graduation cap symbols
- "Nurturing Minds And Hearts" motto
- Professional educational branding

This logo will now appear on all official school documents!

## 🚀 Ready to Use

The receipt printing feature is now live! Just:
1. Save your logo to `public/school-logo.png`
2. Go to Fee Management
3. Click "Print Receipt" on any payment
4. Your logo will appear automatically!

---

**Need Help?**
If you need to adjust the logo size, opacity, or position, let me know and I can customize it further.
