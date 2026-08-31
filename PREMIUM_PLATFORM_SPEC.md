# Nurse Bulao — Premium Healthcare Platform

## Product flow
Home → Choose Care → Choose Service → From Date → Till Date → Shift/Time → Patient Details → Review → Booking ID → Track Booking.

## Roles
- Patient: browse services, create bookings, track booking status.
- Nurse: secure login, profile, availability, assigned bookings, accept/reject/update status.
- Caretaker: secure login, availability, assigned care bookings, status updates.
- Admin: secure login, manage services, nurses, caretakers, bookings and availability.

## Experience requirements
- No WhatsApp dependency for booking.
- WhatsApp is an optional confirmation/notification channel.
- Desktop uses WhatsApp Web when the user chooses WhatsApp.
- Responsive mobile and desktop booking experience.
- From/Till date range is mandatory for long-duration care.
- Booking receives a unique Booking ID and a status timeline.

## Premium UI direction
- Clean healthcare visual language, generous spacing, accessible typography.
- Strong hero CTA: Book a Nurse / Book a Caretaker.
- Service cards with high-quality imagery/3D-style illustrations.
- Sticky booking summary on desktop and bottom CTA on mobile.
- Clear trust, safety, service coverage and process sections.
- AI Care is a navigation/education assistant, not a diagnostic system.

## Netlify
Set:
- NEXT_PUBLIC_API_URL = your deployed API URL
- NEXT_PUBLIC_WHATSAPP_NUMBER = business WhatsApp number in international format

The API/database must be deployed separately for real authentication and persistent bookings.
