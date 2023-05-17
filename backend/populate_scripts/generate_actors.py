import faker as Faker
import psycopg2
import psycopg2.extras

#DB connection

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

# Define the number of entities to insert
num_actors = 1000

# Generate and exectue the SQL insert command in batches of 1000
batch_size = 100
for i in range (num_actors // batch_size):

        #Generate a batch of 100 random actors

        actors = []
        for j in range(batch_size):
                name = fake.name()
                count = 1
                while True:
                        cur.execute("SELECT COUNT(*) FROM api_actor WHERE name = %s", (name,))
                        if cur.fetchone()[0] == 0:
                                break
                        else:
                                count += 1
                                name = f"{fake.name()} {count}"


                cur.execute("SELECT id FROM auth_user ORDER BY RANDOM() LIMIT 1")
                added_by_user_id = cur.fetchone()[0]

                actor = (
                        name,
                        fake.random_element(elements=('Male', 'Female')),
                        fake.random_int(min=18, max=80),
                        fake.random_int(min=0, max=50),
                        fake.country(),
                        added_by_user_id,
                )
                actors.append(actor)

        # Construct the SQL Insert command with the batch of actors

        insert_command = "INSERT INTO api_actor (name, gender, age, experience, nationality) VALUES %s"

        # Use the cursor to execute the SQL command with the batch of actors
        try:
                psycopg2.extras.execute_values(cur, insert_command, actors, template=None, page_size=batch_size)
        except psycopg2.IntegrityError as e:
                # If a duplicate name value is encountered, skip it and continue
                conn.rollback()
                print(f"Skipping duplicate name value: {e}")

        # Commit the transaction to the database
        else:
                conn.commit()

        print(f"Batch {i} completed out of 100.")

# Close the cursor and the conneection
cur.close()
conn.close()

