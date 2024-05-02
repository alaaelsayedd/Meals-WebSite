let loadingpage = document.querySelector(".loading");
/*Loading*/
function displayLoadingPage() {
  loadingpage.style.setProperty("transition", "0s all");
  loadingpage.style.setProperty("opacity", 1);
  loadingpage.style.display = "flex";
  document.body.style.setProperty("overFlow", "hidden");
}
function hideLoadingPage() {
  loadingpage.style.setProperty("transition", "1s all");
  loadingpage.style.setProperty("opacity", 0);

  setTimeout(() => {
    loadingpage.style.display = "none";
  }, 1000);

  document.body.style.setProperty("overFlow", "visible");
}
window.addEventListener("load", hideLoadingPage);

/*SideBar */
let outerSilder = document.querySelector(".side-out");
let outerSiderWidth = outerSilder.offsetLeft;
outerSilder.parentElement.style.setProperty("left", `${-outerSiderWidth}px`);

document.querySelector(".icon i").addEventListener("click", (e) => {
  outerSiderWidth = outerSilder.offsetLeft;
  let leftValueOfSideBar =
    outerSilder.parentElement.style.getPropertyValue("left");
  outerSilder.parentElement.style.setProperty("transition", `1s all`);

  if (leftValueOfSideBar == "0px") {
    e.target.classList.replace("fa-xmark", "fa-bars");
    $(".list-bar li").animate({ top: "50%", opacity: 0 }, 1000);
    outerSilder.parentElement.style.setProperty(
      "left",
      `${-outerSiderWidth}px`
    );
  } else {
    e.target.classList.replace("fa-bars", "fa-xmark");
    outerSilder.parentElement.style.setProperty("left", `0px`);
    $(".list-bar li").animate({ top: 0, opacity: 1 }, 2000);
  }
});
/*Display Meals */
let mealsContainer = document.querySelector(".home-container");
let ingrediantContainer = document.querySelector(".ingrediant-contsiner");
class Meals {
  constructor() {
    this.meals;
    this.categories;
    this.ingredaint;
    this.area;
  }
  async getAllMealsFetch(fetchUrl) {
    displayLoadingPage();
    let response = await fetch(fetchUrl);
    let data = await response.json();
    hideLoadingPage();
    return data;
  }
  async getMealDetailed(id) {
    let mealdetailed = await this.getAllMealsFetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    let meal =mealdetailed.meals[0]
    let recipesdata = [];
    let strTags;
    if (
      mealdetailed.meals[0].strTags != null &&
      mealdetailed.meals[0].strTags != " "
    ) {
      strTags = mealdetailed.meals[0].strTags.split(",");
      strTags = strTags.map((value) => {
        return `<span>${value}</span>`;
      });
      console.log(strTags);
      strTags = strTags.join("");
    }
    let ingredients = ``;
   

    for (let i = 1; i <= 20; i++) {
        if ( meal[`strIngredient${i}`]) {
            ingredients += `<span>${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</span>`
        }
    }

    let ingrediant = `<div class="col-12 col-md-4">
       <div class="incontent">
         <div class="img">
           <img
             src="${mealdetailed.meals[0].strMealThumb} "
             class="w-100 rounded-2"
             alt="meal-img"
           />
         </div>
         <h2>${mealdetailed.meals[0].strMeal}</h2>
       </div>
     </div>
     <div class="col-12 col-md-8">
       <div class="incontent px-2">
         <div class="instr">
           <h3 class="fs-2">Instructions</h3>
           <p>
           ${mealdetailed.meals[0].strInstructions}
           </p>
         </div>
         <h3><span class="fw-bolder">Area : </span> ${
           mealdetailed.meals[0].strArea
         }</h3>
         <h3><span class="fw-bolder">Category : </span> ${
           mealdetailed.meals[0].strCategory
         }</h3>
         <h3>Recipes:</h3>
         <div class="recipes d-flex flex-wrap my-2 mx-2">
         ${ingredients}
          
         </div>
         <h3>Tags:</h3>
         <div class="tags d-flex flex-wrap p-2">
              ${strTags !== undefined ? strTags : ""}
           
         </div>
         <div class="links my-3">
           <a href="${
             mealdetailed.meals[0].strSource
           }"  target="-blank"class="btn btn-success">Source</a>
           <a href="${
             mealdetailed.meals[0].strYoutube
           }"   target="-blank" class="btn btn-danger">Youtue</a>
         </div>
       </div>
     </div>
       `;
    mealsContainer.innerHTML = "";
    ingrediantContainer.innerHTML = ingrediant;

    this.hideContact;
  }
  async dispalymealsStart() {
    this.meals = await this.getAllMealsFetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s="
    );
    this.addMealsCard(this.meals.meals);
  }
  async addMealsCard(mealsDisplayCard) {
    let mealsDisplay = mealsDisplayCard.map((meal) => {
      return `<div class="col" >
                <div class="content position-relative meal-card" data-id="${meal.idMeal}">
                <div class="imge">
                 <img src="${meal.strMealThumb}" class="w-100 h-100 object-fit-cover" alt="img">
               </div>
                 <div class="out d-flex justify-content-center flex-column align-items-center">
                  <h2>${meal.strMeal}</h2>
                  <p></p>
                 </div>
               </div>
             </div>`;
    });
    ingrediantContainer.innerHTML = "";
    this.hideContact();
    mealsContainer.innerHTML = mealsDisplay.join("");
    document.querySelectorAll(".col .content").forEach((meal) => {
      meal.addEventListener("click", (e) => {
        let cradClickedId = e.target.closest(".content").dataset.id;
        this.getMealDetailed(cradClickedId);
      });
    });
  }

  async displayAllCategories() {
    this.categories = await this.getAllMealsFetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    let categoriesDisplay = this.categories.categories.map((category) => {
      return `<div class="col ">
                <div class="content position-relative meal-card" data-name="${
                  category.strCategory
                }">
                <div class="imge">
                 <img src="${
                   category.strCategoryThumb
                 }" class="w-100 h-100 object-fit-cover" alt="img">
               </div>
                 <div class="out d-flex justify-content-center flex-column align-items-center">
                  <h2>${category.strCategory}</h2>
                  <p>${category.strCategoryDescription
                    .split(" ")
                    .slice(0, 20)
                    .join(" ")}</p>
                 </div>
               </div>
             </div>`;
    });
    ingrediantContainer.innerHTML = "";
    mealsContainer.innerHTML = categoriesDisplay.join("");
    this.hideContact();
    document.querySelectorAll(".col .content").forEach((meal) => {
      meal.addEventListener("click", async (e) => {
        let cradClickedId = e.target.closest(".content").dataset.name;
        let filteredCategorey = await this.getAllMealsFetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cradClickedId}`
        );
        this.addMealsCard(filteredCategorey.meals);
      });
    });
  }
  async displayAllIngrediants() {
    this.ingredaint = await this.getAllMealsFetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
    );
    let displayAllIngrediants = this.ingredaint.meals.map(
      (ingredaint, index) => {
        if (index < 20) {
          return ` <div class="col" >
        <div class="content position-relative text-center p-1 " data-name="${
          ingredaint.strIngredient
        }">
          <div class="icon py-2 fs-6">
            <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          </div>
          <h3>${ingredaint.strIngredient}</h3>
          <p>
            ${ingredaint.strDescription.split(" ").slice(0, 20).join(" ")}
          </p>
        </div>
      </div>`;
        }
      }
    );
    this.hideContact();
    ingrediantContainer.innerHTML = "";
    mealsContainer.innerHTML = displayAllIngrediants.join("");
    document.querySelectorAll(".col .content").forEach((meal) => {
      meal.addEventListener("click", async (e) => {
        let cradClickedId = e.target.closest(".content").dataset.name;

        let filteredCategorey = await this.getAllMealsFetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${cradClickedId}`
        );
        this.addMealsCard(filteredCategorey.meals);
      });
    });
  }

  async displayAllAreas() {
    this.area = await this.getAllMealsFetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?a=list"
    );
    let displayArea = this.area.meals.map((area) => {
      return `<div class="col">
                <div class="content position-relative text-center p-1" data-name="${area.strArea}">
                  <div class="icon py-2 fs-6">
                       <i class="fa-solid fa-house-laptop fa-4x"></i>
                    </div>
                 <h3>${area.strArea}</h3>
               </div>
              </div> `;
    });
    ingrediantContainer.innerHTML = "";
    this.hideContact();
    mealsContainer.innerHTML = displayArea.join("");
    document.querySelectorAll(".col .content").forEach((meal) => {
      meal.addEventListener("click", async (e) => {
        let cradClickedId = e.target.closest(".content").dataset.name;
        let filteredArea = await this.getAllMealsFetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${cradClickedId}`
        );
        this.addMealsCard(filteredArea.meals);
      });
    });
  }
  Search() {
    let SearchInput = `<div class="row form-rows mt-5 px-3">
    <div class="mb-3 col-6">
      <input type="text" class="form-control " id="name" placeholder="Search by name">
    </div>
    <div class="mb-3 col-6">
      <input type="text" class="form-control " id="filltername" placeholder="Search By filterName">
    </div>
  </div>`;
    ingrediantContainer.innerHTML = "";
    mealsContainer.innerHTML = "";
    this.hideContact();
    document.querySelector(".forms").innerHTML = SearchInput;
    document.querySelector("#name").addEventListener("input", async (e) => {
      let searchValue = e.target.value;
      let results = await this.getAllMealsFetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`
      );
      this.addMealsCard(results.meals);
    });
    document
      .querySelector("#filltername")
      .addEventListener("input", async (e) => {
        let searchValue = e.target.value;
        let results = await this.getAllMealsFetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchValue}`
        );
        this.addMealsCard(results.meals);
      });
  }
  showContact() {
    ingrediantContainer.innerHTML = "";
    mealsContainer.innerHTML = "";
    document
      .querySelector(".contact-us-form")
      .classList.replace("d-none", "d-block");
  }
  hideContact() {
    document
      .querySelector(".contact-us-form")
      .classList.replace("d-block", "d-none");
  }
}
let meals = new Meals();
meals.dispalymealsStart();
/*Link listofLink With dispaly */
let linksList = document.querySelectorAll(".list-bar li");
linksList.forEach((link) => {
  link.addEventListener("click", (e) => {
    let idOfLink = e.target.getAttribute("id");
    idOfLink == "categories"
      ? meals.displayAllCategories()
      : idOfLink == "area"
      ? meals.displayAllAreas()
      : idOfLink == "ingredients"
      ? meals.displayAllIngrediants()
      : idOfLink == "search"
      ? meals.Search()
      : idOfLink == "contact"?
        meals.showContact()
      :""
  });
});
/**input Validation  */
let regexName = /^[a-zA-Z ]+$/;
let regexEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
let regexNumber = /^01[0125][0-9]{8}$/;
let regexpassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
let regexage = /^(?:[1-5]?\d|60)$/;
let falg = false;
let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let ageInput = document.getElementById("age");
let numberInput = document.getElementById("number");
let passInput = document.getElementById("pass");
let rePassInput = document.getElementById("repass");

$(".contact-us-form input").blur(() => {
  let passvalue;
  if (!regexName.test(nameInput.value)) {
    nameInput.nextElementSibling.innerHTML = "Invaild Name";
    falg = false;
  } else {
    nameInput.nextElementSibling.innerHTML = "";
    falg = true;
  }
  if (!regexEmail.test(emailInput.value)) {
    emailInput.nextElementSibling.innerHTML = "Invaild Email Write vaild Email";
    falg = false;
  } else {
    emailInput.nextElementSibling.innerHTML = "";
    falg = true;
  }
  if (!regexage.test(ageInput.value)) {
    ageInput.nextElementSibling.innerHTML = "Invaild Age";
    falg = false;
  } else {
    ageInput.nextElementSibling.innerHTML = "";
    falg = true;
  }
  if (!regexNumber.test(numberInput.value)) {
    numberInput.nextElementSibling.innerHTML = "Invaild number";
    falg = false;
  } else {
    numberInput.nextElementSibling.innerHTML = "";
    falg = true;
  }

  if (!regexpassword.test(passInput.value)) {
    passInput.nextElementSibling.innerHTML =
      "At least 8 characters long Contains at least one uppercase Contains at least one lowercase  Contains at least one number ";
    falg = false;
  } else {
    passInput.nextElementSibling.innerHTML = "";
    passvalue = passInput.value;
    falg = true;
  }
  if (rePassInput.value != passvalue) {
    rePassInput.nextElementSibling.innerHTML = "not correct password";
    falg = false;
  } else {
    rePassInput.nextElementSibling.innerHTML = "";
    falg = true;
  }
});
$(".contact-us-form input").blur(() => {
if (falg == true) {
    document.querySelector("button").classList.remove("disabled");
} else {
    document.querySelector("button").classList.add("disabled");
}

});
