# Netlify Identity Setup Guide — BTB Lacrosse

This site uses **Netlify Identity** for authentication. Users are managed entirely through the Netlify dashboard — no separate auth service needed.

---

## Step 1: Enable Identity

1. Go to [app.netlify.com](https://app.netlify.com) and open the BTB Lacrosse site
2. Click **Integrations** in the top nav
3. Search for **Identity** and click **Enable**
4. Once enabled, you'll see Identity settings under **Site configuration > Identity**

## Step 2: Set Registration to Invite-Only

1. In Identity settings, click **Registration preferences**
2. Select **Invite only** — this prevents anyone from creating their own account
3. Save

## Step 3: Create Your Owner Account

1. In Identity, click **Invite users**
2. Enter your email address and send the invite
3. Check your email for the invite link and set your password
4. After creating the account, go back to Netlify Identity in the dashboard
5. Click on your user entry
6. Under **app_metadata**, click Edit and set:
   ```json
   {
     "roles": ["owner"]
   }
   ```
7. Under **user_metadata**, set:
   ```json
   {
     "full_name": "Your Name",
     "program": "boys"
   }
   ```
   (The program field doesn't matter for owners — they can access everything)
8. Save

## Step 4: Invite Coaches

1. Click **Invite users** in the Identity panel
2. Enter the coach's email and send the invite
3. After they accept, click on their user entry
4. Set **app_metadata**:
   ```json
   {
     "roles": ["coach"]
   }
   ```
5. Set **user_metadata**:
   ```json
   {
     "full_name": "Coach Name",
     "program": "boys"
   }
   ```
   Use `"boys"` or `"girls"` depending on their program assignment.
6. Save

## Step 5: Invite Players

Same process as coaches, but set the role to `"player"`:

1. Invite by email
2. After they accept, set **app_metadata**:
   ```json
   {
     "roles": ["player"]
   }
   ```
3. Set **user_metadata**:
   ```json
   {
     "full_name": "Player Name",
     "program": "boys",
     "grad_year": "2030"
   }
   ```
4. Save

---

## Role Reference

| Role     | Access                                                              |
|----------|---------------------------------------------------------------------|
| `owner`  | Everything — both programs, all hubs, all content                   |
| `coach`  | Coaches Hub + Players Hub for their assigned program (boys or girls) |
| `player` | Players Hub for their assigned program only                         |

## Metadata Reference

**app_metadata** (set by admin only — controls permissions):
- `roles` — array of strings: `["owner"]`, `["coach"]`, or `["player"]`

**user_metadata** (editable by the user or admin):
- `full_name` — display name shown in the header
- `program` — `"boys"` or `"girls"` — which program they belong to
- `grad_year` — (players only) graduation year like `"2030"`

---

## Troubleshooting

**"Identity is not enabled"** — Make sure Identity is enabled in the Netlify dashboard (Integrations > Identity)

**User can't log in** — They need to accept their invite email first. You can resend it from the Identity panel.

**Wrong role / access denied** — Check the user's app_metadata in the Netlify Identity dashboard. Make sure `roles` is set correctly.

**Password reset** — Users can request a password reset from the login page. The email comes from Netlify's servers.

**Changing a user's program** — Edit their user_metadata in the Identity dashboard and change the `program` field.
