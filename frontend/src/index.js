import axios from 'axios';

window.readMovies = function() {
    axios.get('http://localhost:8080/movies')
        .then((response) => {
            const movieList = response.data;
            const movieUl = document.getElementById('movies');
            movieList.forEach(movie => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(movie.title + ' (' + movie.year + ') ' + movie.description));
                movieUl.appendChild(li);
            })
        });
};