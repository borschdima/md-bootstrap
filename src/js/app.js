document.addEventListener("DOMContentLoaded", () => {
    new WOW().init();

    const addTaskBtn = document.querySelector("#add-task");
    const taskHolder = document.querySelector("#task-holder");

    // Handling deleting and completing tasks
    taskHolder.addEventListener("click", e => {
        const target = e.target;
        const targetClass = target.classList;

        if (targetClass.contains("btn-remove")) {
            target.closest(".col-xs-12").remove();
        } else if (targetClass.contains("btn-done")) {
            target.closest(".card").classList.add("bg-success");

            const cardBody = target.closest(".card-body");
            cardBody.querySelector(".card-text").classList.add("text-white");
            cardBody.querySelector(".card-title").classList.add("text-white");
            target.remove();
        }
    });

    // Adding new task
    addTaskBtn.addEventListener("click", () => {
        const taskResponsible = document.querySelector("#taskResponsible");
        const tasDescription = document.querySelector("#taskDescription");

        const responsible = taskResponsible.value === "" ? "No name" : taskResponsible.value;
        const description = tasDescription.value === "" ? "No description" : tasDescription.value;

        const template = `
        <div class="col-xs-12 col-md-6 col-lg-4">
            <div class="card  mb-3 ">
                <div class="card-body">
                    <h5 class="card-title text-center">${responsible}</h5>
                    <p class="card-text">${description}</p>
                    <div class="control d-flex justify-content-center">
                        <button class="btn-remove btn btn-danger px-2 py-2">Remove</button>
                        <button class="btn-done btn btn-success px-2 py-2">Done</button>
                    </div>
                </div>
            </div>
        </div>`;

        taskHolder.insertAdjacentHTML("beforeend", template);
        taskResponsible.value = "";
        tasDescription.value = "";
    });

    const anchors = [].slice.call(document.querySelectorAll(`a[href*="#"]`));

    anchors.forEach(anchor => {
        anchor.addEventListener("click", e => {
            e.preventDefault();

            const blockID = anchor.getAttribute("href");

            document.querySelector(blockID).scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });

    const feed = new InstagramFeed({
        accessToken: "1393083154.1677ed0.38ea167129b14880a72cd704224248d6", // required
        numberOfPhotosInRow: 6, // optional
        numberOfRows: 2, // optional
        gapBetweenPhotos: 1, // optional
        title: "Я в Instagram" // optional
    });

    feed.init();
});
