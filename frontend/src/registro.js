import axios from 'axios';
import { notifyError, notifyOk} from './dialogUtil.js';
import { el } from './documentUtil.js';

window.addMovie = function() {
    const title = el('title').value;
    const description = el('description').value;
    const year = el('year').value;

    //TODO debo validar los datos
    if (title === '') {
        notifyError('El título es un campo obligatorio');
        return;
    }

    axios.post('http://localhost:8080/movies', {
        title: title,
        description: description,
        year: year
    });

    //TODO debo confirmarle al usuario si todo ha ido bien (o mal)
    notifyOk('Pelicula registrada');
    //TODO debo limpiar el formulario
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('year').value = '';
};