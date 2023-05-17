import faker as Faker
import psycopg2
import psycopg2.extras

# DB connection
conn = psycopg2.connect(
    host='localhost',
    database='moviedb',
    user='postgres',
    password='postgres',
)

# Create a cursor object to execute SQL commands
cur = conn.cursor()

# Create a Faker instance
fake = Faker.Faker()

# Define the number of productions to insert
num_productions = 1000

# Generate and execute the SQL insert command in batches of 1000
batch_size = 100
for i in range(num_productions // batch_size):
    # Generate a batch of 100 random productions
    productions = []
    for j in range(batch_size):
        # Generate production attributes
        company_name = fake.company()
        count = 1
        while True:
            cur.execute("SELECT COUNT(*) FROM api_production WHERE companyname = %s", (company_name,))
            if cur.fetchone()[0] == 0:
                break
            else:
                count += 1
                company_name = f"{fake.company()} {count}"

        # Generate other production attributes (origin_country, website, description)

        origin_country = fake.country()
        website = fake.url()
        description = fake.text()

        # Generate the added_by field
        # You can fetch a random user from the database or specify a specific user as per your requirements
        # Here's an example of fetching a random user from the database
        cur.execute("SELECT id FROM auth_user ORDER BY RANDOM() LIMIT 1")
        added_by_user_id = cur.fetchone()[0]

        production = (
            company_name,
            origin_country,
            website,
            description,
            added_by_user_id,
        )
        productions.append(production)

    # Construct the SQL Insert command with the batch of productions
    insert_command = "INSERT INTO api_production (companyName, origin_country, website, description, added_by_id) VALUES %s"

    # Use the cursor to execute the SQL command with the batch of productions
    try:
        psycopg2.extras.execute_values(
            cur, insert_command, productions, template=None, page_size=batch_size
        )
    except psycopg2.IntegrityError as e:
        # If a duplicate company name or website value is encountered, skip it and continue
        conn.rollback()
        print(f"Skipping duplicate value: {e}")
    else:
        conn.commit()

    print(f"Batch {i} completed out of {num_productions // batch_size}.")

# Close the cursor and the connection
cur.close()
conn.close()