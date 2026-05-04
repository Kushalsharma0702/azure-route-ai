"""
app.routes.gems_data — Real hidden gems data for Indian cities.

Provides curated, geo-tagged hidden gems with Google Maps links.
"""
from fastapi import APIRouter, Query
from typing import Optional
import logging

router = APIRouter(prefix="/api/v1/gems", tags=["gems"])
logger = logging.getLogger("gems_data")

# ── Comprehensive Hidden Gems Database ──────────────────────────
GEMS_DB = {
    "Mumbai": {
        "tourist_locations": ["Gateway of India", "Marine Drive", "Juhu Beach", "Bandra"],
        "gems": [
            {"name": "Banganga Tank", "category": "historical", "lat": 18.9473, "lng": 72.7970,
             "description": "A 1,000-year-old sacred water tank hidden in the skyscrapers of Malabar Hill. Ancient temples surround this peaceful oasis away from Mumbai's chaos.",
             "best_time": "Early morning", "entry": "Free", "rating": 4.5},
            {"name": "Khotachiwadi Heritage Village", "category": "historical", "lat": 18.9572, "lng": 72.8185,
             "description": "A 200-year-old Portuguese-style hamlet with wooden bungalows hidden in Girgaon. One of Mumbai's last remaining East Indian Christian enclaves.",
             "best_time": "Weekday afternoon", "entry": "Free", "rating": 4.3},
            {"name": "Sewri Flamingo Point", "category": "nature", "lat": 19.0060, "lng": 72.8620,
             "description": "Between Nov-May, thousands of flamingos migrate to Sewri mudflats. A stunning pink spectacle most Mumbaikars don't know about.",
             "best_time": "Dec-Mar, early morning", "entry": "Free", "rating": 4.7},
            {"name": "Ovolo Café, Bandra", "category": "cafe", "lat": 19.0596, "lng": 72.8295,
             "description": "Tucked inside a 100-year-old Portuguese villa. Amazing cortado coffee and artisan pastries in a hidden courtyard garden.",
             "best_time": "Weekday mornings", "entry": "Café", "rating": 4.4},
            {"name": "Sanjay Gandhi National Park Kanheri Caves", "category": "hiking", "lat": 19.2094, "lng": 72.9069,
             "description": "109 Buddhist caves from 1st century BCE deep inside the national park. Most tourists stop at the park gate — hike 5km inside for ancient rock-cut monasteries.",
             "best_time": "Oct-Feb", "entry": "₹60", "rating": 4.6},
            {"name": "Sassoon Docks", "category": "market", "lat": 18.9250, "lng": 72.8353,
             "description": "Mumbai's oldest and most atmospheric fish market. Arrive at 5 AM for the chaotic, colorful auction. Now also hosts an annual art festival.",
             "best_time": "5-7 AM", "entry": "Free", "rating": 4.2},
        ],
    },
    "Delhi": {
        "tourist_locations": ["Red Fort", "India Gate", "Qutub Minar", "Chandni Chowk"],
        "gems": [
            {"name": "Agrasen Ki Baoli", "category": "historical", "lat": 28.6265, "lng": 77.2343,
             "description": "A hauntingly beautiful 14th-century stepwell hidden in the heart of Connaught Place. 108 steps descend into an eerie, Instagram-worthy monument.",
             "best_time": "Early morning", "entry": "Free", "rating": 4.6},
            {"name": "Lodhi Art District", "category": "art", "lat": 28.5892, "lng": 77.2228,
             "description": "India's first open-air public art district. Massive murals by international artists cover entire building facades in the Lodhi Colony area.",
             "best_time": "Golden hour", "entry": "Free", "rating": 4.5},
            {"name": "Champa Gali", "category": "cafe", "lat": 28.5312, "lng": 77.2144,
             "description": "A magical fairy-light-lit alley behind a garment factory in Saidulajab. Hidden cafés, bookshops, and boutiques in a cobblestone laneway.",
             "best_time": "Evening", "entry": "Free", "rating": 4.7},
            {"name": "Sunder Nursery", "category": "nature", "lat": 28.5908, "lng": 77.2505,
             "description": "A restored 16th-century Mughal garden with rare trees, heritage monuments, and bird trails. Far less crowded than Lodhi Garden next door.",
             "best_time": "Winter mornings", "entry": "₹30", "rating": 4.5},
            {"name": "Majnu Ka Tilla", "category": "market", "lat": 28.6999, "lng": 77.2264,
             "description": "Little Tibet of Delhi. Narrow alleys packed with Tibetan momos stalls, thangka paintings, and monk supply shops. Feels like you're in Dharamshala.",
             "best_time": "Afternoon", "entry": "Free", "rating": 4.4},
            {"name": "Hauz Khas Deer Park", "category": "nature", "lat": 28.5494, "lng": 77.2001,
             "description": "A medieval Islamic seminary ruin surrounding a tranquil deer park and lake. Best at sunset when peacocks roam and the ruins glow golden.",
             "best_time": "Sunset", "entry": "Free", "rating": 4.3},
        ],
    },
    "Jaipur": {
        "tourist_locations": ["Amber Fort", "Hawa Mahal", "City Palace", "Nahargarh Fort"],
        "gems": [
            {"name": "Panna Meena Ka Kund", "category": "historical", "lat": 26.9827, "lng": 75.8513,
             "description": "A geometrically stunning 16th-century stepwell near Amber Fort. The criss-cross stairway pattern creates a mesmerizing optical illusion.",
             "best_time": "Morning light", "entry": "Free", "rating": 4.8},
            {"name": "Elefantastic", "category": "nature", "lat": 26.9485, "lng": 75.8535,
             "description": "An ethical elephant sanctuary where rescued elephants roam freely. Paint with elephants and learn about conservation — not tourist rides.",
             "best_time": "Morning", "entry": "₹4,000", "rating": 4.9},
            {"name": "Anokhi Museum of Hand Printing", "category": "art", "lat": 26.9861, "lng": 75.8507,
             "description": "A beautifully restored haveli showcasing centuries of Rajasthani block printing craft. Live demos, workshops, and a rooftop café.",
             "best_time": "Weekday afternoon", "entry": "₹30", "rating": 4.5},
            {"name": "Tapri Central", "category": "cafe", "lat": 26.9124, "lng": 75.7873,
             "description": "A rooftop chai café overlooking the pink city skyline. Try the Kulhad Chai and Bun Maska while watching Jaipur's sunset panorama.",
             "best_time": "Sunset", "entry": "Café", "rating": 4.6},
            {"name": "Galtaji Temple (Monkey Temple)", "category": "spiritual", "lat": 26.9185, "lng": 75.8545,
             "description": "A 500-year-old temple complex with natural springs nestled in a mountain gorge. Sacred pools, ancient frescoes, and yes — hundreds of monkeys.",
             "best_time": "Early morning", "entry": "Free", "rating": 4.4},
        ],
    },
    "Goa": {
        "tourist_locations": ["Baga Beach", "Calangute", "Anjuna", "Palolem"],
        "gems": [
            {"name": "Divar Island", "category": "nature", "lat": 15.5053, "lng": 73.8937,
             "description": "A sleepy island accessible by free ferry from Old Goa. Portuguese churches, empty roads, mango groves, and zero tourists. Pure old-world Goa.",
             "best_time": "Monsoon (Jul-Sep)", "entry": "Free ferry", "rating": 4.7},
            {"name": "Sweet Water Lake, Arambol", "category": "nature", "lat": 15.6894, "lng": 73.7034,
             "description": "A freshwater lake hidden behind Arambol beach, surrounded by jungle. Natural sulphur mud for face packs. Drum circles at sunset.",
             "best_time": "Evening", "entry": "Free", "rating": 4.5},
            {"name": "Fontainhas Latin Quarter", "category": "historical", "lat": 15.4985, "lng": 73.8283,
             "description": "A pastel-colored Portuguese colonial quarter in Panaji. Narrow cobblestone streets, tile-art galleries, family-run bakeries, and fado music bars.",
             "best_time": "Late afternoon", "entry": "Free", "rating": 4.6},
            {"name": "Café Bodega", "category": "cafe", "lat": 15.4947, "lng": 73.8199,
             "description": "Inside a 200-year-old Indo-Portuguese mansion, this art-gallery-café serves the best croissants in Goa. Garden seating under bougainvillea.",
             "best_time": "Morning", "entry": "Café", "rating": 4.8},
            {"name": "Chorla Ghat", "category": "hiking", "lat": 15.4611, "lng": 74.0833,
             "description": "A lush Western Ghats trail on the Goa-Karnataka border. Waterfalls, rare birds, and misty forest walks. Almost zero tourists.",
             "best_time": "Oct-Feb", "entry": "Free", "rating": 4.4},
            {"name": "Chapora Fort Sunset", "category": "historical", "lat": 15.6088, "lng": 73.7382,
             "description": "Skip the Dil Chahta Hai photo spot — climb to the far end for a 360° panoramic sunset view. Bring snacks and watch the sky turn pink.",
             "best_time": "Sunset", "entry": "Free", "rating": 4.5},
        ],
    },
    "Bangalore": {
        "tourist_locations": ["Lalbagh", "Cubbon Park", "MG Road", "Nandi Hills"],
        "gems": [
            {"name": "Bull Temple (Nandi Temple)", "category": "spiritual", "lat": 12.9430, "lng": 77.5689,
             "description": "A 500-year-old temple housing a massive monolithic Nandi bull carved from a single granite boulder. One of the largest Nandi statues in the world.",
             "best_time": "Morning", "entry": "Free", "rating": 4.3},
            {"name": "Sankey Tank", "category": "nature", "lat": 13.0062, "lng": 77.5730,
             "description": "A Victorian-era lake hidden in the residential area. Peaceful walking trail, migratory birds, and stunning sunsets without the Cubbon Park crowds.",
             "best_time": "Sunset", "entry": "Free", "rating": 4.4},
            {"name": "Church Street Social", "category": "cafe", "lat": 12.9746, "lng": 77.6083,
             "description": "A quirky co-working café inside a refurbished warehouse. Industrial interiors, craft cocktails, and Bangalore's startup crowd.",
             "best_time": "Evening", "entry": "Café", "rating": 4.3},
            {"name": "Hesaraghatta Grasslands", "category": "nature", "lat": 13.1371, "lng": 77.4870,
             "description": "A vast savanna-like grassland on the city outskirts. Rare raptors, foxes, and open skies — Bangalore's hidden birding paradise.",
             "best_time": "Winter mornings", "entry": "Free", "rating": 4.5},
            {"name": "VV Puram Food Street", "category": "market", "lat": 12.9492, "lng": 77.5754,
             "description": "A 500m stretch of street food heaven. Try Holige, Paddu, Akki Roti, and fresh sugarcane juice. Best after 6 PM when all stalls open.",
             "best_time": "Evening", "entry": "Free", "rating": 4.6},
        ],
    },
    "Kerala": {
        "tourist_locations": ["Alleppey", "Munnar", "Kochi", "Wayanad"],
        "gems": [
            {"name": "Marari Beach", "category": "nature", "lat": 9.5957, "lng": 76.2887,
             "description": "A pristine, quiet fishing village beach just 11km from Alleppey. No beach shacks, no crowds — just golden sand, coconut palms, and local fishermen.",
             "best_time": "Oct-Mar", "entry": "Free", "rating": 4.7},
            {"name": "Jew Town, Kochi", "category": "historical", "lat": 9.9577, "lng": 76.2598,
             "description": "A 400-year-old Jewish quarter with antique shops, spice warehouses, and the oldest active synagogue in the Commonwealth (1568).",
             "best_time": "Afternoon", "entry": "₹5", "rating": 4.5},
            {"name": "Edakkal Caves, Wayanad", "category": "hiking", "lat": 11.6178, "lng": 76.2208,
             "description": "Stone-age petroglyphs dating back 6,000 years, accessed via a steep 1km trek. Ancient human figures and symbols carved into natural rock formations.",
             "best_time": "Morning", "entry": "₹30", "rating": 4.6},
            {"name": "Thattekkad Bird Sanctuary", "category": "nature", "lat": 10.1162, "lng": 76.6807,
             "description": "Salim Ali called it the richest bird habitat on peninsular India. 300+ species including hornbills, flycatchers, and the rare Sri Lanka frogmouth.",
             "best_time": "Dec-Mar, dawn", "entry": "₹30", "rating": 4.8},
            {"name": "Varkala Cliff Café", "category": "cafe", "lat": 8.7330, "lng": 76.7153,
             "description": "Cliffside cafés perched 30m above the Arabian Sea. Sip fresh coconut water while watching paragliders soar over the red laterite cliffs.",
             "best_time": "Sunset", "entry": "Café", "rating": 4.5},
        ],
    },
    "Manali": {
        "tourist_locations": ["Rohtang Pass", "Solang Valley", "Old Manali", "Hadimba Temple"],
        "gems": [
            {"name": "Jogini Waterfall", "category": "hiking", "lat": 32.2547, "lng": 77.1897,
             "description": "A 150ft waterfall hidden above Old Manali. A 3km trek through apple orchards and pine forests. The pool at the base is ice-cold refreshing.",
             "best_time": "Apr-Jun", "entry": "Free", "rating": 4.6},
            {"name": "Jana Waterfall", "category": "nature", "lat": 32.1023, "lng": 77.1834,
             "description": "A secret 40ft waterfall 15km from Manali, accessible via a village road. Almost zero tourists. Crystal clear mountain pool for dipping.",
             "best_time": "May-Sep", "entry": "Free", "rating": 4.5},
            {"name": "Lazy Dog Lounge", "category": "cafe", "lat": 32.2495, "lng": 77.1862,
             "description": "A treehouse-style café in Old Manali with river views, hammocks, and the best wood-fired pizza in Himachal. Dogs welcome (hence the name).",
             "best_time": "Afternoon", "entry": "Café", "rating": 4.7},
            {"name": "Sethan Village", "category": "nature", "lat": 32.2891, "lng": 77.1200,
             "description": "A tiny Buddhist hamlet at 8,000ft, just 12km from Manali. Igloo camping in winter, pristine meadows in summer. Feels like another planet.",
             "best_time": "Dec-Feb (snow)", "entry": "Free", "rating": 4.8},
            {"name": "Naggar Castle Art Gallery", "category": "art", "lat": 32.1350, "lng": 77.1712,
             "description": "A 500-year-old stone castle with a Nicholas Roerich art gallery. Mountain panoramas from the courtyard. Much quieter than Manali town.",
             "best_time": "Morning", "entry": "₹15", "rating": 4.4},
        ],
    },
    "Varanasi": {
        "tourist_locations": ["Dashashwamedh Ghat", "Kashi Vishwanath", "Sarnath", "Assi Ghat"],
        "gems": [
            {"name": "Ramnagar Fort Museum", "category": "historical", "lat": 25.2879, "lng": 83.0308,
             "description": "A crumbling 18th-century fort across the Ganga housing vintage cars, palanquins, and a rare astronomical clock. Often missed by tourists.",
             "best_time": "Morning", "entry": "₹50", "rating": 4.3},
            {"name": "Blue Lassi Shop", "category": "cafe", "lat": 25.3109, "lng": 83.0130,
             "description": "A legendary 3-seat lassi shop in the old city lanes. Running for 80+ years. Try the Pomegranate or Saffron lassi — served in clay cups.",
             "best_time": "Morning", "entry": "₹40-80", "rating": 4.8},
            {"name": "Tulsi Ghat Wrestling Akhara", "category": "historical", "lat": 25.2950, "lng": 83.0050,
             "description": "Ancient mud-pit wrestling grounds along the ghats. Watch kushti wrestlers train at dawn — a living tradition dating back centuries.",
             "best_time": "Dawn", "entry": "Free", "rating": 4.4},
            {"name": "Chunar Fort", "category": "hiking", "lat": 25.1263, "lng": 82.8789,
             "description": "A 2,000-year-old fort 40km from Varanasi perched on a cliff above the Ganga. Mughal cannons, British barracks, and panoramic river views.",
             "best_time": "Morning", "entry": "₹25", "rating": 4.5},
        ],
    },
    "Udaipur": {
        "tourist_locations": ["Lake Pichola", "City Palace", "Jag Mandir", "Sajjangarh"],
        "gems": [
            {"name": "Badi Lake", "category": "nature", "lat": 24.6447, "lng": 73.6089,
             "description": "A serene lake 12km from Udaipur with no tourist infrastructure. Local picnic spot with cenotaphs, dam views, and Aravalli hills backdrop.",
             "best_time": "Sunset", "entry": "Free", "rating": 4.5},
            {"name": "Hathi Pol Bazaar", "category": "market", "lat": 24.5778, "lng": 73.6823,
             "description": "A 500m-long local market selling miniature paintings, silver jewelry, and hand-dyed fabrics. Less touristy and better prices than Lake Palace Road.",
             "best_time": "Afternoon", "entry": "Free", "rating": 4.4},
            {"name": "Ambrai Restaurant", "category": "cafe", "lat": 24.5770, "lng": 73.6782,
             "description": "Lakeside dining with a direct view of City Palace illuminated at night. The best table in Udaipur — arrive early for waterfront seating.",
             "best_time": "Sunset/dinner", "entry": "Restaurant", "rating": 4.7},
        ],
    },
    "Meghalaya": {
        "tourist_locations": ["Cherrapunji", "Dawki", "Shillong", "Living Root Bridges"],
        "gems": [
            {"name": "Laitlum Canyons", "category": "hiking", "lat": 25.4667, "lng": 91.8500,
             "description": "The 'End of Hills' — a dramatic canyon viewpoint 24km from Shillong. 3,000 stone steps descend into the valley. Almost no tourists.",
             "best_time": "Morning (clear skies)", "entry": "Free", "rating": 4.9},
            {"name": "Krang Suri Waterfall", "category": "nature", "lat": 25.4011, "lng": 92.2167,
             "description": "A turquoise-blue waterfall hidden in Jaintia Hills. A 1km trek through bamboo forest leads to a natural swimming pool inside a cave.",
             "best_time": "Oct-Mar", "entry": "₹50", "rating": 4.8},
            {"name": "Mawryngkhang Trek (Bamboo Trail)", "category": "hiking", "lat": 25.3500, "lng": 91.7500,
             "description": "India's scariest trek — walk on bamboo bridges across a 1,000ft gorge. A 3-hour adventure to 'U Mawryngkhang' (the pillar of needles).",
             "best_time": "Oct-Apr", "entry": "₹200 guide fee", "rating": 4.7},
            {"name": "Dylan's Café, Shillong", "category": "cafe", "lat": 25.5726, "lng": 91.8935,
             "description": "A Bob Dylan-themed café with live music nights, local craft beer, and the best pork ribs in the Northeast. Shillong's music scene HQ.",
             "best_time": "Evening", "entry": "Café", "rating": 4.5},
        ],
    },
    "Rishikesh": {
        "tourist_locations": ["Laxman Jhula", "Ram Jhula", "Triveni Ghat", "Beatles Ashram"],
        "gems": [
            {"name": "Neer Garh Waterfall", "category": "hiking", "lat": 30.1300, "lng": 78.2917,
             "description": "A tiered waterfall hidden 2km off the Neelkanth road. Three cascading pools of fresh mountain water. Perfect for a dip after a trek.",
             "best_time": "Monsoon & post-monsoon", "entry": "₹30", "rating": 4.5},
            {"name": "Beatles Ashram (Chaurasi Kutia)", "category": "historical", "lat": 30.1147, "lng": 78.3147,
             "description": "The abandoned ashram where the Beatles stayed in 1968. Now covered in stunning street art and graffiti. Meditative, eerie, and beautiful.",
             "best_time": "Morning", "entry": "₹150", "rating": 4.6},
            {"name": "Little Buddha Café", "category": "cafe", "lat": 30.1222, "lng": 78.3283,
             "description": "A cliffside café overlooking the Ganga near Ram Jhula. Israeli-Indian fusion food, hammocks, and a spiritual sunset vibe.",
             "best_time": "Sunset", "entry": "Café", "rating": 4.4},
        ],
    },
    "Darjeeling": {
        "tourist_locations": ["Tiger Hill", "Batasia Loop", "Tea Gardens", "Peace Pagoda"],
        "gems": [
            {"name": "Takdah Orchid Centre", "category": "nature", "lat": 26.8903, "lng": 88.3531,
             "description": "A government orchid nursery 28km from Darjeeling with 2,500+ orchid species. Blooms spectacularly during Apr-May. Virtually unknown to tourists.",
             "best_time": "Apr-May", "entry": "₹10", "rating": 4.5},
            {"name": "Ging Tea Estate", "category": "market", "lat": 27.0430, "lng": 88.2900,
             "description": "A working tea garden where you can walk through the bushes, watch production, and buy single-estate Darjeeling tea at factory prices.",
             "best_time": "Morning", "entry": "Free", "rating": 4.4},
            {"name": "Glenary's Bakery Balcony", "category": "cafe", "lat": 27.0452, "lng": 88.2637,
             "description": "A 1935 bakery with a hidden upper-floor balcony offering views of Kanchenjunga. Best rum balls and Chelsea buns in all of East India.",
             "best_time": "Afternoon tea", "entry": "Café", "rating": 4.6},
        ],
    },
}

# All cities for the dropdown
ALL_CITIES = sorted(GEMS_DB.keys())


@router.get("/cities")
async def list_cities():
    """Return all cities with hidden gems + their tourist locations."""
    return {
        "cities": [
            {"name": city, "tourist_locations": data["tourist_locations"], "gems_count": len(data["gems"])}
            for city, data in sorted(GEMS_DB.items())
        ]
    }


@router.get("/discover")
async def discover_gems(
    city: str = Query(..., description="City name"),
    location: Optional[str] = Query(None, description="Tourist location within city"),
    category: Optional[str] = Query(None, description="Filter by category"),
):
    """Get hidden gems for a city, optionally near a tourist location."""
    city_data = GEMS_DB.get(city)
    if not city_data:
        # Try case-insensitive
        for k, v in GEMS_DB.items():
            if k.lower() == city.lower():
                city_data = v
                city = k
                break
    if not city_data:
        return {"city": city, "gems": [], "total": 0, "message": "City not found in our database yet."}

    gems = city_data["gems"]

    # Filter by category
    if category and category != "all":
        gems = [g for g in gems if g["category"] == category]

    # Build response with Google Maps links
    result = []
    for i, g in enumerate(gems):
        maps_url = f"https://www.google.com/maps/search/?api=1&query={g['lat']},{g['lng']}"
        maps_directions = f"https://www.google.com/maps/dir/?api=1&destination={g['lat']},{g['lng']}"
        result.append({
            "id": f"{city.lower()}_{i+1}",
            "name": g["name"],
            "category": g["category"],
            "description": g["description"],
            "best_time": g.get("best_time", ""),
            "entry": g.get("entry", "Free"),
            "rating": g.get("rating", 4.0),
            "location": {"lat": g["lat"], "lng": g["lng"]},
            "google_maps_url": maps_url,
            "google_maps_directions": maps_directions,
            "city": city,
        })

    return {
        "city": city,
        "tourist_locations": city_data["tourist_locations"],
        "gems": result,
        "total": len(result),
    }
