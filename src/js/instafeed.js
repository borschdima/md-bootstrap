// const token = "1393083154.1677ed0.38ea167129b14880a72cd704224248d6";
// const mediaId = "2173487114180965715_1393083154";

function InstagramFeed(obj) {
    const { accessToken, numberOfPhotosInRow = 5, numberOfRows = 2, gapBetweenPhotos = 0, title = "Я в инстаграмме" } = obj;

    const likeIcon = `<svg class="eapps-instagram-feed-posts-item-likes-count-icon" viewBox="0 0 24 24">
    <path d="M17.7,1.5c-2,0-3.3,0.5-4.9,2.1c0,0-0.4,0.4-0.7,0.7c-0.3-0.3-0.7-0.7-0.7-0.7c-1.6-1.6-3-2.1-5-2.1C2.6,1.5,0,4.6,0,8.3
    c0,4.2,3.4,7.1,8.6,11.5c0.9,0.8,1.9,1.6,2.9,2.5c0.1,0.1,0.3,0.2,0.5,0.2s0.3-0.1,0.5-0.2c1.1-1,2.1-1.8,3.1-2.7
    c4.8-4.1,8.5-7.1,8.5-11.4C24,4.6,21.4,1.5,17.7,1.5z M14.6,18.6c-0.8,0.7-1.7,1.5-2.6,2.3c-0.9-0.7-1.7-1.4-2.5-2.1
    c-5-4.2-8.1-6.9-8.1-10.5c0-3.1,2.1-5.5,4.9-5.5c1.5,0,2.6,0.3,3.8,1.5c1,1,1.2,1.2,1.2,1.2C11.6,5.9,11.7,6,12,6.1
    c0.3,0,0.5-0.2,0.7-0.4c0,0,0.2-0.2,1.2-1.3c1.3-1.3,2.1-1.5,3.8-1.5c2.8,0,4.9,2.4,4.9,5.5C22.6,11.9,19.4,14.6,14.6,18.6z"></path>
    </svg>`;
    const commentIcon = `<svg class="eapps-instagram-feed-posts-item-comments-count-icon" viewBox="0 0 24 24">
    <path d="M1,11.9C1,17.9,5.8,23,12,23c1.9,0,3.7-1,5.3-1.8l5,1.3l0,0c0.1,0,0.1,0,0.2,0c0.4,0,0.6-0.3,0.6-0.6c0-0.1,0-0.1,0-0.2
    l-1.3-4.9c0.9-1.6,1.4-2.9,1.4-4.8C23,5.8,18,1,12,1C5.9,1,1,5.9,1,11.9z M2.4,11.9c0-5.2,4.3-9.5,9.5-9.5c5.3,0,9.6,4.2,9.6,9.5
    c0,1.7-0.5,3-1.3,4.4l0,0c-0.1,0.1-0.1,0.2-0.1,0.3c0,0.1,0,0.1,0,0.1l0,0l1.1,4.1l-4.1-1.1l0,0c-0.1,0-0.1,0-0.2,0
    c-0.1,0-0.2,0-0.3,0.1l0,0c-1.4,0.8-3.1,1.8-4.8,1.8C6.7,21.6,2.4,17.2,2.4,11.9z"></path>
    </svg>`;

    const getInstData = async () => {
        try {
            const firstResponse = await fetch(`https://api.instagram.com/v1/users/self/media/recent/?access_token=${accessToken}&count=50`);
            const firstPortion = await firstResponse.json();
            const secondResponse = await fetch(firstPortion.pagination.next_url);
            const secondPortion = await secondResponse.json();

            return [...firstPortion.data, ...secondPortion.data];
        } catch (error) {
            console.error(error);
        }
    };

    // Делаем сдвиг слайдера вправо или влево
    const moveSlidesHandler = e => {
        const container = document.querySelector("#instafeed .container-inst");
        const arrowForward = document.querySelector("#instafeed .arrow.forward");
        const arrowBack = document.querySelector("#instafeed .arrow.back");
        const coef = container.dataset.coef;
        const root = document.querySelector("#instafeed .container-inst");
        const containerWidth = root.parentElement.offsetWidth;

        // Слайд вперед
        if (e.target === arrowForward) {
            if (container.dataset.coef != container.dataset.maxCoef) {
                root.style.transform = `translate(-${containerWidth * coef}px)`;
                container.dataset.coef++;
                arrowBack.style.display = "flex";
                if (container.dataset.coef == container.dataset.maxCoef) arrowForward.style.display = "none";
            }
        }
        // Слайд назад
        else if (e.target === arrowBack) {
            if (container.dataset.coef != 1) {
                root.style.transform = `translate(-${containerWidth * (coef - 1) - containerWidth}px)`;
                container.dataset.coef--;
                arrowForward.style.display = "flex";
                if (container.dataset.coef == 1) arrowBack.style.display = "none";
            }
        }
    };

    // Формируем базовые элементы ленты и слайдера, заполняем их фотографиями
    const showFeed = async posts => {
        const root = document.querySelector("#instafeed");
        const widgetTitle = document.createElement("h2");
        const container = document.createElement("div");
        const backArrow = document.createElement("div");
        const forwardArrow = document.createElement("div");
        const fragment = document.createDocumentFragment();

        widgetTitle.id = "instafeed-title";
        container.classList.add("container-inst");
        backArrow.classList.add("arrow", "back");
        forwardArrow.classList.add("arrow", "forward");

        backArrow.textContent = "‹";
        forwardArrow.textContent = "›";
        widgetTitle.textContent = `${title}`;

        root.insertAdjacentElement("beforebegin", widgetTitle);
        root.appendChild(backArrow);
        root.appendChild(forwardArrow);
        root.appendChild(container);

        root.addEventListener("click", e => moveSlidesHandler(e));

        console.log(posts);
        container.setAttribute("data-max-coef", Math.ceil(posts.length / (numberOfPhotosInRow * numberOfRows)));
        container.setAttribute("data-coef", 1);

        // Функция создает слайд и загружает в него фотографии
        const fillSlideWithPhotos = () => {
            const block = document.createElement("div");
            block.classList.add("block");
            block.style.width = `${container.parentElement.offsetWidth}px`;
            block.appendChild(fragment);
            container.appendChild(block);
        };

        posts.forEach((post, i) => {
            const div = document.createElement("div");
            const img = document.createElement("img");
            const containerWidth = container.parentElement.offsetWidth;

            div.classList.add("post");

            const sizeOfPhoto = `${containerWidth / numberOfPhotosInRow - gapBetweenPhotos}px`; // размер фото с учетом отступов между фото и ширины контейнера
            div.style.width = sizeOfPhoto;
            div.style.height = sizeOfPhoto;
            div.style.margin = `${gapBetweenPhotos / 2}px`;
            img.setAttribute("src", post.images.low_resolution.url);

            div.appendChild(img);
            fragment.appendChild(div);

            showPhotoData(div, post);

            // Если слайд заполнился нужныи количеством фотографий, выгружаем их и заполняем новый слайд
            if (fragment.childElementCount === numberOfPhotosInRow * numberOfRows) {
                fillSlideWithPhotos();
            }
        });
        // Выводим оставшиеся посты, если они остались
        if (fragment.childElementCount != 0) {
            fillSlideWithPhotos();
        }
    };

    // К кажому посту добавляет информацию (количество лайков, комментов, описание поста)
    const showPhotoData = (div, postInfo) => {
        const info = document.createElement("div");
        const counters = document.createElement("div");
        const likes = document.createElement("div");
        const likeIconDiv = document.createElement("div");
        const likeCount = document.createElement("div");
        const comments = document.createElement("div");
        const commentsIconDiv = document.createElement("div");
        const commentsCount = document.createElement("div");
        const text = document.createElement("div");

        info.classList.add("info");
        counters.classList.add("counters");
        likes.classList.add("counter-item", "likes");
        text.classList.add("text");
        likeIconDiv.classList.add("icon");

        likeIconDiv.insertAdjacentHTML("afterbegin", likeIcon);
        likeCount.textContent = postInfo.likes.count;
        text.textContent = returnCaption(postInfo.caption);

        likes.appendChild(likeIconDiv);
        likes.appendChild(likeCount);
        counters.appendChild(likes);
        info.appendChild(counters);
        info.appendChild(text);
        div.appendChild(info);

        if (postInfo.comments.count >= 1) {
            comments.classList.add("counter-item", "comments");
            commentsIconDiv.classList.add("icon");
            commentsIconDiv.insertAdjacentHTML("afterbegin", commentIcon);
            commentsCount.textContent = postInfo.comments.count;
            comments.appendChild(commentsIconDiv);
            comments.appendChild(commentsCount);
            counters.appendChild(comments);
        }
    };

    // Возвращает укороченную версию описания поста
    const returnCaption = caption => {
        if (!caption) return "";

        let fullText = "";
        const words = caption.text.split(" ");
        const wordsLimit = numberOfPhotosInRow > 5 ? 9 : 15;

        words.forEach((word, index) => {
            if (index <= wordsLimit) fullText += word + " ";
        });

        return fullText + "...";
    };

    // Функция инициализирующая создание ленты. Единственная доступная пользователю функция (видно на объекте, созданным конструктором)
    const init = async () => {
        try {
            const data = await getInstData();
            await showFeed(data);
        } catch (error) {
            console.error(error);
        }
    };

    return Object.freeze({
        init
    });
}
