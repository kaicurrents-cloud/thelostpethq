# The Lost Pet HQ — Product Roadmap

## Vision
The #1 platform people turn to when they lose a pet. Free core tools, premium services, and a nationwide network that actually reunites pets with families.

---

## Phase 1: MVP Launch ✅ → 🚀
**Status:** Built, ready to deploy
**Timeline:** This week

### Deliverables
- [x] Multi-step form (pet info, photo, location, contact)
- [x] Flyer generator (canvas-based, downloadable JPG)
- [x] Action checklist
- [x] Resource links (PetFinder, Nextdoor, Facebook, PawBoost)
- [x] Affiliate product section (GPS trackers, AirTags, QR tags)
- [ ] Deploy to Vercel/Netlify
- [ ] Get domain (PawAlertHQ.com or similar)
- [ ] Set up Amazon Associates affiliate account
- [ ] Replace placeholder affiliate links with real ones
- [ ] Basic SEO meta tags
- [ ] Google Analytics

### Revenue: Affiliate only
- GPS trackers: ~4-8% commission ($4-12 per sale)
- Pet tags/accessories: ~4% commission

---

## Phase 2: Flyer Location Map 🗺️
**Timeline:** Week 2

### Deliverables
- [ ] Google Places API integration
- [ ] "Best places to hang flyers" map based on zip code
- [ ] Location types: dog parks, regular parks, vet offices, pet stores, coffee shops, grocery stores, community boards, busy intersections
- [ ] Distance + foot traffic ranking
- [ ] Printable list version
- [ ] "Get directions" links

### Tech Required
- Google Places API key (~$0.032 per request, first $200/mo free)
- Leaflet.js or Google Maps embed

### Revenue: Still affiliate (increases engagement/trust)

---

## Phase 3: Lost Pet Database 🐕
**Timeline:** Weeks 3-4

### Deliverables
- [ ] Database to store lost pet submissions (with owner consent)
- [ ] Public searchable registry ("Found a pet? Search here")
- [ ] Map view of lost pets in area
- [ ] "I found this pet" contact button (anonymized initially)
- [ ] Email alerts: "A pet matching your description was found nearby"
- [ ] Shelter integration (pull from PetFinder API for found pets)
- [ ] "Mark as found" / "Still missing" status updates
- [ ] Social proof: "127 pets reunited this month"

### Tech Required
- Backend: Supabase (free tier) or Firebase
- Database schema: pets, users, sightings, matches
- Email service: Resend or SendGrid (free tier)
- PetFinder API (free)

### Revenue: Affiliate + future premium potential
- Builds moat (network effect)
- More users = more valuable = harder to compete with

---

## Phase 4: AI Shelter Caller 📞 💰
**Timeline:** Weeks 5-6

### Deliverables
- [ ] AI phone agent integration (Bland.ai or Vapi)
- [ ] Script: "Hi, I'm calling on behalf of [owner] who lost their [pet type], a [breed] named [name] on [date] near [location]. The pet is [description]. If a matching animal comes in, please contact [phone]. Thank you."
- [ ] Auto-pull shelter list from Google Places / PetFinder by radius
- [ ] User selects radius (10/25/50 miles)
- [ ] Payment integration (Stripe)
- [ ] Call logging dashboard (which shelters called, results)
- [ ] Follow-up calls option (daily for X days)

### Pricing
- Basic: $9.99 — calls shelters within 10 miles (one-time)
- Pro: $19.99 — calls within 25 miles + daily follow-ups for 7 days
- Premium: $39.99 — 50 mile radius + 14 days follow-ups + vet offices

### Tech Required
- Bland.ai or Vapi account (~$0.09/min)
- Stripe for payments
- Background job runner for scheduled calls

### Revenue: DIRECT REVENUE 🎯
- Cost per call: ~$0.15-0.30 (avg 1-2 min)
- 20 shelters = ~$5 cost
- Charge $10-20 = 50-75% margin
- High conversion (people are desperate, this saves hours)

---

## Phase 5: Growth & Expansion 📈
**Timeline:** Ongoing

### SEO & Content
- [ ] Blog: "What to do when your dog is lost" (target high-volume keywords)
- [ ] Breed-specific pages: "Lost Golden Retriever? Here's what to do"
- [ ] City-specific pages: "Lost pet resources in Boise, ID"
- [ ] Success stories (social proof)

### Partnerships
- [ ] Shelter partnerships (they recommend us, we send them traffic)
- [ ] Vet office partnerships (flyers in waiting rooms)
- [ ] Pet store partnerships (Petco, local shops)
- [ ] Pet insurance partnerships (affiliate or lead gen)

### Additional Premium Features (Future)
- [ ] Physical flyer printing + mailing service
- [ ] Boosted visibility in lost pet database
- [ ] Premium profile with more photos/details
- [ ] "Alert neighbors" push notification network (app users nearby)

### Mobile App (Future)
- [ ] React Native or Flutter
- [ ] Push notifications for nearby lost/found pets
- [ ] Camera integration for quick flyer creation
- [ ] "I spotted this pet" reporting

---

## Tech Stack

| Layer | Tool | Cost |
|-------|------|------|
| Frontend | HTML/CSS/JS (vanilla) | Free |
| Hosting | Vercel or Netlify | Free |
| Database | Supabase | Free tier |
| Maps | Google Places API | Free tier ($200/mo credit) |
| Email | Resend | Free tier |
| Payments | Stripe | 2.9% + $0.30 per transaction |
| AI Calls | Bland.ai | ~$0.09/min |
| Analytics | Google Analytics / Plausible | Free |
| Domain | Namecheap/Porkbun | ~$10/year |

**Total startup cost: ~$10 (domain only)**

---

## Revenue Projections

### Month 1-2 (MVP + Affiliates)
- Traffic: 500-1,000 visitors
- Affiliate conversions: 1-2%
- Revenue: $50-200/mo

### Month 3-4 (Database + AI Caller)
- Traffic: 2,000-5,000 visitors
- AI Caller sales: 10-30/mo @ $15 avg
- Affiliate: $100-300/mo
- Revenue: $250-750/mo

### Month 6+ (SEO kicks in)
- Traffic: 10,000+ visitors
- AI Caller sales: 50-100/mo
- Affiliate: $500+/mo
- Revenue: $1,500-3,000/mo

### Year 1 Goal: $2,000+/month recurring

---

## Immediate Next Steps

1. **TODAY:** Deploy MVP to Vercel
2. **TODAY:** Grab domain
3. **THIS WEEK:** Set up affiliate accounts (Amazon, Chewy)
4. **THIS WEEK:** First Reddit/Facebook posts for traffic
5. **NEXT WEEK:** Start Phase 2 (flyer map)

---

*Last updated: Feb 4, 2026*
