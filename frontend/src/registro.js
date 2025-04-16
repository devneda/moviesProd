import axios from 'axios';
import { notifyError, notifyOk} from './dialogUtil.js';
import { el } from './documentUtil.js';

window.addMovie = function() {
    const title = el('title').value;
    const description = el('description').value;
    const year = el('year').value;
    const image = el('image').files[0];

    //TODO debo validar los datos
    if (title === '') {
        notifyError('El título es un campo obligatorio');
        return;
    }

    //TODO implementar la opcion de subir una imagen 
    
    const formData = new FormData();
    formData.append('description', description);
    formData.append('year', year);
    formData.append('title', title);
    if (image) {
        formData.append('image', image);
    }
    axios.post('http://localhost:8080/movies', formData)
        .then((response) => {
            notifyOk('Los datos se han registrado correctamente');
            el('title').value = '';
            el('description').value = '';
            el('year').value = '';
            el('image').value = '';
        })
        .catch((error) => {
            notifyError('Se ha producido un error al enviar los datos');
        });
};
