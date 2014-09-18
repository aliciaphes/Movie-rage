Movie-rage
==========

This app is still in progress and needs to be properly 'pampered' (meaning it's missing some CSS)

Create average score of movies reading from different APIs. So far we read from:
- Rotten Tomatoes
- OMDB
- USA Today
- The Movie DB

How to use:

- You need to have a separate file and call it 'keys.json' where you store your keys from the different API's. Format is:

{
	"API name": "key",
	...
}

- Just type the movie you want to search.

- The logic reads the keys file to build the query to fetch the movie.

- Average is shown.


