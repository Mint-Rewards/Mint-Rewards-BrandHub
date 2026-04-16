import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DATABASE_NAME = process.env.DATABASE_NAME || "mint_rewards";

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);

    console.log("Connected to MongoDB");

    // Sample brand data
    const sampleBrand = {
      id: "sample-brand-1",
      brand_name: "Sample Brand",
      company_name: "Sample Company Ltd",
      category: "Technology",
      website: "https://sample.com",
      description: "A sample brand for testing",
      address: "123 Sample Street, Sample City",
      status: "approved",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Sample contact data
    const sampleContact = {
      id: "sample-contact-1",
      brand_id: "sample-brand-1",
      contact_name: "John Doe",
      contact_email: "john@sample.com",
      contact_phone: "+1234567890",
      registration_number: "REG123456",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Sample assets data
    const sampleAssets = {
      id: "sample-assets-1",
      brand_id: "sample-brand-1",
      logo_url: "https://via.placeholder.com/200x200",
      theme_color: "#3B82F6",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Sample campaign data
    const sampleCampaign = {
      id: "sample-campaign-1",
      brand_id: "sample-brand-1",
      title: "Summer Sale Campaign",
      description: "A great summer sale campaign",
      campaign_type: "seasonal",
      budget: 5000,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      target_audience: "Young adults",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Sample deal data
    const sampleDeal = {
      id: "sample-deal-1",
      brand_id: "sample-brand-1",
      title: "20% Off Summer Sale",
      description: "Get 20% off on all summer products",
      discount_percentage: 20,
      discount_amount: null,
      minimum_purchase: 100,
      max_uses: 1000,
      current_uses: 0,
      promo_code: "SUMMER20",
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert sample data
    await db.collection("brands").insertOne(sampleBrand);
    console.log("✅ Inserted sample brand");

    await db.collection("brand_contacts").insertOne(sampleContact);
    console.log("✅ Inserted sample contact");

    await db.collection("brand_assets").insertOne(sampleAssets);
    console.log("✅ Inserted sample assets");

    await db.collection("campaigns").insertOne(sampleCampaign);
    console.log("✅ Inserted sample campaign");

    await db.collection("deals").insertOne(sampleDeal);
    console.log("✅ Inserted sample deal");

    // Create indexes for better performance
    await db.collection("brands").createIndex({ id: 1 }, { unique: true });
    await db.collection("brands").createIndex({ status: 1 });

    await db.collection("campaigns").createIndex({ brand_id: 1 });
    await db.collection("campaigns").createIndex({ status: 1 });

    await db.collection("deals").createIndex({ brand_id: 1 });
    await db.collection("deals").createIndex({ status: 1 });

    await db
      .collection("brand_contacts")
      .createIndex({ brand_id: 1 }, { unique: true });
    await db
      .collection("brand_assets")
      .createIndex({ brand_id: 1 }, { unique: true });

    console.log("✅ Created database indexes");
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await client.close();
  }
}

// Run the seeding function if this script is executed directly
if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };
