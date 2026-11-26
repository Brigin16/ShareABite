# CHAPTER 1: INTRODUCTION

## 1.1 Introduction

Food waste is a critical global challenge, with approximately 40% of food produced in India going to waste annually. This wastage occurs not due to spoilage, but primarily due to logistical challenges in connecting surplus food sources with those in need. Simultaneously, millions face food insecurity daily. ShareABite (formerly Anna Setu) addresses this paradox by creating a technological bridge between food donors and community receivers.

ShareABite is a comprehensive web-based platform that facilitates the entire food rescue lifecycle. The platform connects four key stakeholders: donors (restaurants, hotels, and individuals with surplus food), volunteers (who handle logistics), receivers (NGOs and shelters serving communities in need), and administrators (who coordinate operations). By leveraging modern web technologies and automated testing frameworks, ShareABite ensures reliable, efficient, and transparent food donation management.

The platform recognizes that not all surplus food serves the same purpose. It categorizes donations into three streams: food suitable for human consumption, food appropriate for animal shelters, and organic waste suitable for composting. This comprehensive approach ensures that no edible resource goes to waste while also contributing to environmental sustainability through compost revenue generation.

## 1.2 Scope of the Project

### Functional Scope:

**User Management System:**
- Multi-role authentication (Donor, Volunteer, Receiver, Admin)
- JWT-based secure login and registration
- Role-based access control
- User verification and approval workflow

**Donation Management:**
- Schedule food pickups with detailed specifications
- Real-time status tracking (Pending → Assigned → Picked Up → Delivered)
- Donation history and analytics
- Food categorization (human, animal, compost)

**Volunteer Coordination:**
- Task assignment and acceptance
- Quality check forms during pickup
- Status update capabilities
- Training materials access

**Receiver Operations:**
- Post specific food requirements
- Track incoming deliveries
- Confirm receipt of donations
- Dashboard for delivery management

**Administrative Oversight:**
- Comprehensive dashboard with live statistics
- User verification and approval
- Donation-to-volunteer assignment
- Compost revenue tracking
- System-wide monitoring

### Technical Scope:

**Backend Development:**
- RESTful API architecture using Node.js and Express.js
- MongoDB database with Mongoose ODM
- JWT authentication implementation
- 15+ API endpoints covering all operations

**Frontend Development:**
- Responsive web interface using HTML5, CSS3, and Vanilla JavaScript
- Eight distinct pages (landing, login, signup, four role-specific dashboards, profile)
- Real-time form validation
- Dynamic content rendering

**Testing Implementation:**
- Backend API testing using Jest and Supertest
- Frontend end-to-end testing using Cypress
- Automated test suites with 7 comprehensive test cases
- Continuous integration ready

### Out of Scope:
- Mobile native applications
- Real-time chat functionality
- GPS-based route optimization
- Payment gateway integration
- Multi-language support
