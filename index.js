
const postContainer = document.querySelector('#post-container'),
      clickButton = document.querySelector('#clickButton'),
      getButton = document.querySelector('#getButton')

// url для запроса
const urlComments = 'https://jsonplaceholder.typicode.com/comments'

const loaders = document.querySelector('#loader'),
      finished  = document.querySelector('#finish'),
      containerForLoaders = document.querySelector('.header__wrapper-menu')

// создает уведомление о загрузки запроса
const loader = (element, containerElement) => {

    if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden')
    } else {
        element.setAttribute('hidden', '')
    }

    containerElement.append(element)
}

// создание уведомление о том что запрос прошла успешно
const finish = (element, containerElement) => {

    if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden')
    } else {
        element.setAttribute('hidden', '')
    }

    containerElement.append(element)
}

// отправить запрос
function createAndSendRequest() {
    loader(loaders, containerForLoaders)
    let name = document.querySelector('#form-name').value;
    let surname = document.querySelector('#form-surname').value;
    let email = document.querySelector('#form-email').value ;

    const sendObject = {
        name,
        surname,
        email
    }

    const request = fetch(urlComments, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(sendObject)
    })

    request
        .then(() => {
            console.log('done')
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            loader(loaders, containerForLoaders)
            finish(finished, containerForLoaders)
            setTimeout(() => {
                finish(finished, containerForLoaders)
            }, 2000)
        })
}


// create usersPost
function createPost(name, email, comment) {
    const post = document.createElement('div')
    post.classList.add('posts')
    post.innerHTML = `
        <div class="posts__name">name: ${name}</div>
        <div class="posts__surname">email: ${email}</div>
        <hr>
        <div class="posts__email">comment: ${comment}</div>
    `

    return post
}

// создает массив для перебора постов в сервере
const createArr = (number) => {
    let newArr = []

    for ( let i = 1; i <= number; i++ ) {
        newArr.push(i)
    }

    return newArr
}

// фукнция для получение постов
function getDataBase() {
    const valueInput = Number(document.querySelector('#numberPost').value)

    const arrayForGetPosts = createArr(valueInput)

    const result = arrayForGetPosts.map(id => {
        return fetch(`${urlComments}/${id}`, {
            method: 'GET'
        })
    })

    Promise.all(result)
        .then(response => {
            if (response[0].ok) {
                const done = response.map(response => response.json())
                return Promise.all(done)
            } else {
                throw new Error('ОШИБКА ЗАПРОСА')
            }
        })
        .then(result => {
            result.map(item => {
                const comment = createPost(item.name, item.email, item.body)
                postContainer.append(comment)
            })
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            loader(loaders, containerForLoaders)
        })
}

clickButton.addEventListener('click', (event) => {
    event.preventDefault()
    createAndSendRequest()

    setTimeout(() => {
        document.querySelector('#form-name').value = ''
        document.querySelector('#form-surname').value = ''
        document.querySelector('#form-email').value = ''
    }, 1000)
})

getButton.addEventListener('click', (event) => {
    event.preventDefault()

    loader(loaders, containerForLoaders)
    postContainer.innerHTML = ''
    getDataBase()

    setTimeout(() => {
        document.querySelector('#numberPost').value = ''
    })
})

