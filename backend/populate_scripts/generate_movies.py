import faker as Faker
import psycopg2
import psycopg2.extras
from datetime import date

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

# Define the number of movies to insert
num_movies = 1000

# Generate and execute the SQL insert command in batches of 1000
batch_size = 100
for i in range(num_movies // batch_size):
    # Generate a batch of 100 random movies
    movies = []
    for j in range(batch_size):
        # Generate movie attributes
        name = fake.text(max_nb_chars=50)
        count = 1
        while True:
            cur.execute("SELECT COUNT(*) FROM api_movie WHERE name = %s", (name,))
            if cur.fetchone()[0] == 0:
                break
            else:
                count += 1
                name = f"{fake.text(max_nb_chars=50)} {count}"

        # Generate other movie attributes (releaseYear, rating, genre, budget)
        release_year = fake.date_between(start_date='-30y', end_date='today')
        rating = fake.pydecimal(left_digits=1, right_digits=1, positive=True)
        genre = fake.word()
        budget = fake.pydecimal(left_digits=8, right_digits=2, positive=True)

        # Generate the production, added_by

        # Generate a random production_id between 100 and 1 million
        production_id = fake.random_int(min=100, max=1000000)
        cur.execute("SELECT id FROM auth_user ORDER BY RANDOM() LIMIT 1")
        added_by_user_id = cur.fetchone()[0]

        movie = (
            name,
            release_year,
            rating,
            genre,
            budget,
            production_id,
            added_by_user_id,
        )
        movies.append(movie)

    # Construct the SQL Insert command with the batch of movies
    insert_command = "INSERT INTO api_movie (name, \"releaseYear\", rating, genre, budget, production_id, added_by_id) VALUES %s"

    # Use the cursor to execute the SQL command with the batch of movies
    try:
        psycopg2.extras.execute_values(
            cur, insert_command, movies, template=None, page_size=batch_size
        )
    except psycopg2.IntegrityError as e:
        # If a duplicate name value is encountered, skip it and continue
        conn.rollback()
        print(f"Skipping duplicate value: {e}")
    else:
        conn.commit()

    print(f"Batch {i} completed out of {num_movies // batch_size}.")

# Close the cursor and the connection
cur.close()
conn.close()