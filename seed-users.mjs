import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const users = [
  { email: "admin@tech.com", password: "Admin@12345", display_name: "Admin One", role: "admin" },
  ...Array.from({ length: 20 }, (_, i) => ({
    email: `student${i + 1}@tech.com`,
    password: "Student@12345",
    display_name: `Student ${i + 1}`,
    role: "student",
  })),
];

for (const u of users) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true, // no email sending
    user_metadata: { display_name: u.display_name, role: u.role },
  });

  if (error) {
    console.log(`ERR ${u.email}: ${error.message}`);
    continue;
  }
  console.log(`OK  ${u.email}: ${data.user.id}`);
}
