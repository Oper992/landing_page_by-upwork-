"use strict";

let map;

function myMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 0, lng: 0 },
  });
}

(() => {
  const formRef = document.querySelector(".form");
  const formFullscreen = document.querySelector(".fullscreen__form");
  let country = "";
  let city = "";
  let street = "";
  let houseNumber = "";

  formRef.addEventListener("submit", (e) => {
    e.preventDefault();

    // A backend request must be made

    if (e.submitter.id === "contactFormButton") {
      renderDetailsForm();
    }
    if (e.submitter.id === "detailsFormButton") {
      renderTimeForm();
    }
    if (e.submitter.id === "timeFormButton") {
      renderCurrentGeolocationForm();
    }
    if (e.submitter.id === "locationFormButton") {
      formFullscreen.innerHTML = `<p>Thank you for contacting us, we will contact you shortly!</p>`
    }
  });

  function renderDetailsForm() {
    const detailsFormMarkup = `<h3 class="form-fullscreen__title">Please fill in the details</h3>
    <div class="form__row">
      <label class="form__label" for="Question_1">Question 1</label>
      <input
        class="form__input"
        type="text"
        id="Question_1"
        name="Question"
        placeholder="Your question"
        value=""
        required
        aria-required="true"
      />
    </div>
    <div class="form__row">
      <label class="form__label" for="Question_2">Question 2</label>
      <input
        class="form__input tel"
        id="Question_2"
        type="text"
        value=""
        name="Question"
        placeholder="Your question"
        required
      />
    </div>
    <p class="form__label form__title-Question-3">Question 3</p>
    <div class="form__row">
    <label>
    <input type="checkbox" name="BHK" value="1 BHK"> 1 BHK</label>
  <label>
    <input type="checkbox" name="BHK" value="2 BHK">
    2 BHK
  </label>
  <label>
    <input type="checkbox" name="BHK" value="3 BHK">
    3 BHK
  </label>
  <label>
    <input type="checkbox" name="BHK" value="4 BHK">
    4 BHK
  </label>
  </div>
    <button
      id="detailsFormButton"
      type="submit"
      class="form__button btn"
    >
    Submit
    </button>`;

    formRef.innerHTML = detailsFormMarkup;
  }

  function renderTimeForm() {
    const timeFormMarkup = `<h3 class="form-fullscreen__title">Best time to contact you</h3>
    <div class="form__row form__time-form" role="group" aria-labelledby="time" >
    <label>
      <input type="checkbox" name="time" value="9 AM – 12 PM">
      9 AM – 12 PM
    </label>
    <label>
      <input type="checkbox" name="time" value="1 PM – 3 PM">
      1 PM – 3 PM
    </label>
    <label>
      <input type="checkbox" name="time" value="3 PM – 6 PM">
      3 PM – 6 PM
    </label>
    <label>
      <input type="checkbox" name="time" value="8 PM – 10 PM">
      8 PM – 10 PM
    </label>
  </div>
    <button
    id="timeFormButton"
      type="submit"
      class="form__button btn"
    >
    Submit
    </button>`;

    formRef.innerHTML = timeFormMarkup;
  }

  function renderCurrentGeolocationForm() {
    const googleMapContainerMarkup = `<div id="map" style="width: 100%; height: 300px"></div>`;
    const userAddressFormMarkup = `
    <div class="form__row">
       <label class="form__label" for="Country">Country</label>
       <input
         class="form__input"
         type="text"
         id="Country"
         name="Country"
         placeholder="Your country"
         value=""
         required
         aria-required="true"
      />
    </div>
    <div class="form__row">
        <label class="form__label" for="City">City</label>
        <input
          class="form__input"
          id="City"
          type="text"                   
          value=""
          name="City"
          placeholder="Your question"
          required
       />
    </div>
    <div class="form__row">
        <label class="form__label" for="Street">Street</label>
        <input
          class="form__input"
          id="Street"
          type="text"                   
          value=""
          name="Street"
          placeholder="Your street"
          required
       />
    </div>
    <div class="form__row">
        <label class="form__label" for="HouseNumber">House number</label>
        <input
          class="form__input"
          id="HouseNumber"
          type="text"                   
          value=""
          name="HouseNumber"
          placeholder="Your house number"
          required
       />
    </div>
   <button
     id="locationFormButton"
     type="submit"
     class="form__button btn"
   >
   Submit
   </button>`;
   

    formFullscreen.insertAdjacentHTML("afterbegin", googleMapContainerMarkup);

    loadScriptGoogleMap();

    formRef.innerHTML = userAddressFormMarkup;

    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode(
              { location: { lat: latitude, lng: longitude } },
              function (results, status) {
                if (status === "OK") {
                  if (results[0]) {
                    var addressComponents = results[0].address_components;

                    for (var i = 0; i < addressComponents.length; i++) {
                      var component = addressComponents[i];

                      if (component.types.includes("locality")) {
                        city = component.long_name;
                        const cityInputForm = document.querySelector("#City");
                        cityInputForm.setAttribute("value", city);
                      } else if (component.types.includes("route")) {
                        street = component.long_name;
                        const streetInputForm =
                          document.querySelector("#Street");
                        streetInputForm.setAttribute("value", street);
                      } else if (component.types.includes("street_number")) {
                        houseNumber = component.long_name;
                        const houseNumberInputForm =
                          document.querySelector("#HouseNumber");
                        houseNumberInputForm.setAttribute("value", houseNumber);
                      } else if (component.types.includes("country")) {
                        country = component.long_name;
                        const countryNumberInputForm =
                          document.querySelector("#Country");
                        countryNumberInputForm.setAttribute("value", country);
                      }
                    }

                    // Отправить данные на сервер
                    // var url = "share-location.php";
                    // var data = {
                    //   city: city,
                    //   street: street,
                    //   houseNumber: houseNumber,
                    // };
                    // fetch(url, {
                    //   method: "POST",
                    //   headers: {
                    //     "Content-Type": "application/json",
                    //   },
                    //   body: JSON.stringify(data),
                    // })
                    //   .then((response) => response.text())
                    //   .then((data) => {
                    //     // Обработать ответ от сервера
                    //     console.log(data);
                    //   })
                    //   .catch((error) => {
                    //     // Обработать ошибку получения геолокации
                    //     console.log("Ошибка получения геолокации");
                    //   });

                    // Показать информацию о местоположении
                    var contentString =
                      "<h3>Мое местоположение:</h3>" +
                      "<p>Город: " +
                      city +
                      "</p>" +
                      "<p>Улица: " +
                      street +
                      "</p>" +
                      "<p>Дом: " +
                      houseNumber +
                      "</p>";
                    var infowindow = new google.maps.InfoWindow({
                      content: contentString,
                    });
                    var marker = new google.maps.Marker({
                      position: { lat: latitude, lng: longitude },
                      map: map,
                      title: "Мое местоположение",
                    });
                    infowindow.open(map, marker);
                  } else {
                    // Обработать случай, когда результатов геокодирования не найдено
                    console.log("Результатов геокодирования не найдено");
                  }
                } else {
                  // Обработать ошибку геокодирования
                  console.log("Ошибка геокодирования: " + status);
                }
              }
            );
          },
          function () {
            // Обработать ошибку получения геолокации
            console.log("Ошибка получ");
          }
        );
      }
    }, 500);
  }

  function loadScriptGoogleMap() {
    var script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ28l4nTwwlxnp_nAsOZ_qH1qe3t8zQEE&callback=myMap&libraries=places";
    script.defer = true;
    script.id = "googleMap";
    document.body.appendChild(script);
  }
// -------------------------------------------------------------------------------------------------------------------------------
  const modules_flsModules = {};
  function isWebp() {
    function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
        callback(2 == webP.height);
      };
      webP.src =
        "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }
    testWebP(function (support) {
      let className = true === support ? "webp" : "no-webp";
      document.documentElement.classList.add(className);
    });
  }

  let _slideUp = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = `${target.offsetHeight}px`;
      target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.hidden = !showmore ? true : false;
        !showmore ? target.style.removeProperty("height") : null;
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        !showmore ? target.style.removeProperty("overflow") : null;
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(
          new CustomEvent("slideUpDone", {
            detail: {
              target,
            },
          })
        );
      }, duration);
    }
  };
  let _slideDown = (target, duration = 500, showmore = 0) => {
    if (!target.classList.contains("_slide")) {
      target.classList.add("_slide");
      target.hidden = target.hidden ? false : null;
      showmore ? target.style.removeProperty("height") : null;
      let height = target.offsetHeight;
      target.style.overflow = "hidden";
      target.style.height = showmore ? `${showmore}px` : `0px`;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + "ms";
      target.style.height = height + "px";
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      window.setTimeout(() => {
        target.style.removeProperty("height");
        target.style.removeProperty("overflow");
        target.style.removeProperty("transition-duration");
        target.style.removeProperty("transition-property");
        target.classList.remove("_slide");
        document.dispatchEvent(
          new CustomEvent("slideDownDone", {
            detail: {
              target,
            },
          })
        );
      }, duration);
    }
  };
  let _slideToggle = (target, duration = 500) => {
    if (target.hidden) return _slideDown(target, duration);
    else return _slideUp(target, duration);
  };
  let bodyLockStatus = true;
  let bodyLockToggle = (delay = 500) => {
    if (document.documentElement.classList.contains("lock")) bodyUnlock(delay);
    else bodyLock(delay);
  };
  let bodyUnlock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      setTimeout(() => {
        for (let index = 0; index < lock_padding.length; index++) {
          const el = lock_padding[index];
          el.style.paddingRight = "0px";
        }
        body.style.paddingRight = "0px";
        document.documentElement.classList.remove("lock");
      }, delay);
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  let bodyLock = (delay = 500) => {
    let body = document.querySelector("body");
    if (bodyLockStatus) {
      let lock_padding = document.querySelectorAll("[data-lp]");
      for (let index = 0; index < lock_padding.length; index++) {
        const el = lock_padding[index];
        el.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px";
      }
      body.style.paddingRight =
        window.innerWidth -
        document.querySelector(".wrapper").offsetWidth +
        "px";
      document.documentElement.classList.add("lock");
      bodyLockStatus = false;
      setTimeout(function () {
        bodyLockStatus = true;
      }, delay);
    }
  };
  function menuInit() {
    if (document.querySelector(".icon-menu"))
      document.addEventListener("click", function (e) {
        if (bodyLockStatus && e.target.closest(".icon-menu")) {
          bodyLockToggle();
          document.documentElement.classList.toggle("menu-open");
        }
      });
  }
  function functions_FLS(message) {
    setTimeout(() => {
      if (window.FLS) console.log(message);
    }, 0);
  }

  let formValidate = {
    getErrors(form) {
      let error = 0;
      let formRequiredItems = form.querySelectorAll("*[data-required]");
      if (formRequiredItems.length)
        formRequiredItems.forEach((formRequiredItem) => {
          if (
            (null !== formRequiredItem.offsetParent ||
              "SELECT" === formRequiredItem.tagName) &&
            !formRequiredItem.disabled
          )
            error += this.validateInput(formRequiredItem);
        });
      return error;
    },
    validateInput(formRequiredItem) {
      let error = 0;
      if ("email" === formRequiredItem.dataset.required) {
        formRequiredItem.value = formRequiredItem.value.replace(" ", "");
        if (this.emailTest(formRequiredItem)) {
          this.addError(formRequiredItem);
          error++;
        } else this.removeError(formRequiredItem);
      } else if (
        "checkbox" === formRequiredItem.type &&
        !formRequiredItem.checked
      ) {
        this.addError(formRequiredItem);
        error++;
      } else if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        error++;
      } else this.removeError(formRequiredItem);
      return error;
    },
    addError(formRequiredItem) {
      formRequiredItem.classList.add("_form-error");
      formRequiredItem.parentElement.classList.add("_form-error");
      let inputError =
        formRequiredItem.parentElement.querySelector(".form__error");
      if (inputError) formRequiredItem.parentElement.removeChild(inputError);
      if (formRequiredItem.dataset.error)
        formRequiredItem.parentElement.insertAdjacentHTML(
          "beforeend",
          `<div class="form__error">${formRequiredItem.dataset.error}</div>`
        );
    },
    removeError(formRequiredItem) {
      formRequiredItem.classList.remove("_form-error");
      formRequiredItem.parentElement.classList.remove("_form-error");
      if (formRequiredItem.parentElement.querySelector(".form__error"))
        formRequiredItem.parentElement.removeChild(
          formRequiredItem.parentElement.querySelector(".form__error")
        );
    },
    formClean(form) {
      form.reset();
      setTimeout(() => {
        let inputs = form.querySelectorAll("input,textarea");
        for (let index = 0; index < inputs.length; index++) {
          const el = inputs[index];
          el.parentElement.classList.remove("_form-focus");
          el.classList.remove("_form-focus");
          formValidate.removeError(el);
        }
        let checkboxes = form.querySelectorAll(".checkbox__input");
        if (checkboxes.length > 0)
          for (let index = 0; index < checkboxes.length; index++) {
            const checkbox = checkboxes[index];
            checkbox.checked = false;
          }
        if (modules_flsModules.select) {
          let selects = form.querySelectorAll(".select");
          if (selects.length)
            for (let index = 0; index < selects.length; index++) {
              const select = selects[index].querySelector("select");
              modules_flsModules.select.selectBuild(select);
            }
        }
      }, 0);
    },
    emailTest(formRequiredItem) {
      return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
        formRequiredItem.value
      );
    },
  };
  class SelectConstructor {
    constructor(props, data = null) {
      let defaultConfig = {
        init: true,
        logging: true,
      };
      this.config = Object.assign(defaultConfig, props);
      this.selectClasses = {
        classSelect: "select",
        classSelectBody: "select__body",
        classSelectTitle: "select__title",
        classSelectValue: "select__value",
        classSelectLabel: "select__label",
        classSelectInput: "select__input",
        classSelectText: "select__text",
        classSelectLink: "select__link",
        classSelectOptions: "select__options",
        classSelectOptionsScroll: "select__scroll",
        classSelectOption: "select__option",
        classSelectContent: "select__content",
        classSelectRow: "select__row",
        classSelectData: "select__asset",
        classSelectDisabled: "_select-disabled",
        classSelectTag: "_select-tag",
        classSelectOpen: "_select-open",
        classSelectActive: "_select-active",
        classSelectFocus: "_select-focus",
        classSelectMultiple: "_select-multiple",
        classSelectCheckBox: "_select-checkbox",
        classSelectOptionSelected: "_select-selected",
        classSelectPseudoLabel: "_select-pseudo-label",
      };
      this._this = this;
      if (this.config.init) {
        const selectItems = data
          ? document.querySelectorAll(data)
          : document.querySelectorAll("select");
        if (selectItems.length) {
          this.selectsInit(selectItems);
          this.setLogging(
            `Прокинувся, построїв селектов: (${selectItems.length})`
          );
        } else this.setLogging("Сплю, немає жодного select");
      }
    }
    getSelectClass(className) {
      return `.${className}`;
    }
    getSelectElement(selectItem, className) {
      return {
        originalSelect: selectItem.querySelector("select"),
        selectElement: selectItem.querySelector(this.getSelectClass(className)),
      };
    }
    selectsInit(selectItems) {
      selectItems.forEach((originalSelect, index) => {
        this.selectInit(originalSelect, index + 1);
      });
      document.addEventListener(
        "click",
        function (e) {
          this.selectsActions(e);
        }.bind(this)
      );
      document.addEventListener(
        "keydown",
        function (e) {
          this.selectsActions(e);
        }.bind(this)
      );
      document.addEventListener(
        "focusin",
        function (e) {
          this.selectsActions(e);
        }.bind(this)
      );
      document.addEventListener(
        "focusout",
        function (e) {
          this.selectsActions(e);
        }.bind(this)
      );
    }
    selectInit(originalSelect, index) {
      const _this = this;
      let selectItem = document.createElement("div");
      selectItem.classList.add(this.selectClasses.classSelect);
      originalSelect.parentNode.insertBefore(selectItem, originalSelect);
      selectItem.appendChild(originalSelect);
      originalSelect.hidden = true;
      index ? (originalSelect.dataset.id = index) : null;
      if (this.getSelectPlaceholder(originalSelect)) {
        originalSelect.dataset.placeholder =
          this.getSelectPlaceholder(originalSelect).value;
        if (this.getSelectPlaceholder(originalSelect).label.show) {
          const selectItemTitle = this.getSelectElement(
            selectItem,
            this.selectClasses.classSelectTitle
          ).selectElement;
          selectItemTitle.insertAdjacentHTML(
            "afterbegin",
            `<span class="${this.selectClasses.classSelectLabel}">${
              this.getSelectPlaceholder(originalSelect).label.text
                ? this.getSelectPlaceholder(originalSelect).label.text
                : this.getSelectPlaceholder(originalSelect).value
            }</span>`
          );
        }
      }
      selectItem.insertAdjacentHTML(
        "beforeend",
        `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`
      );
      this.selectBuild(originalSelect);
      originalSelect.dataset.speed = originalSelect.dataset.speed
        ? originalSelect.dataset.speed
        : "150";
      originalSelect.addEventListener("change", function (e) {
        _this.selectChange(e);
      });
    }
    selectBuild(originalSelect) {
      const selectItem = originalSelect.parentElement;
      selectItem.dataset.id = originalSelect.dataset.id;
      originalSelect.dataset.classModif
        ? selectItem.classList.add(
            `select_${originalSelect.dataset.classModif}`
          )
        : null;
      originalSelect.multiple
        ? selectItem.classList.add(this.selectClasses.classSelectMultiple)
        : selectItem.classList.remove(this.selectClasses.classSelectMultiple);
      originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple
        ? selectItem.classList.add(this.selectClasses.classSelectCheckBox)
        : selectItem.classList.remove(this.selectClasses.classSelectCheckBox);
      this.setSelectTitleValue(selectItem, originalSelect);
      this.setOptions(selectItem, originalSelect);
      originalSelect.hasAttribute("data-search")
        ? this.searchActions(selectItem)
        : null;
      originalSelect.hasAttribute("data-open")
        ? this.selectAction(selectItem)
        : null;
      this.selectDisabled(selectItem, originalSelect);
    }
    selectsActions(e) {
      const targetElement = e.target;
      const targetType = e.type;
      if (
        targetElement.closest(
          this.getSelectClass(this.selectClasses.classSelect)
        ) ||
        targetElement.closest(
          this.getSelectClass(this.selectClasses.classSelectTag)
        )
      ) {
        const selectItem = targetElement.closest(".select")
          ? targetElement.closest(".select")
          : document.querySelector(
              `.${this.selectClasses.classSelect}[data-id="${
                targetElement.closest(
                  this.getSelectClass(this.selectClasses.classSelectTag)
                ).dataset.selectId
              }"]`
            );
        const originalSelect = this.getSelectElement(selectItem).originalSelect;
        if ("click" === targetType) {
          if (!originalSelect.disabled)
            if (
              targetElement.closest(
                this.getSelectClass(this.selectClasses.classSelectTag)
              )
            ) {
              const targetTag = targetElement.closest(
                this.getSelectClass(this.selectClasses.classSelectTag)
              );
              const optionItem = document.querySelector(
                `.${this.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`
              );
              this.optionAction(selectItem, originalSelect, optionItem);
            } else if (
              targetElement.closest(
                this.getSelectClass(this.selectClasses.classSelectTitle)
              )
            )
              this.selectAction(selectItem);
            else if (
              targetElement.closest(
                this.getSelectClass(this.selectClasses.classSelectOption)
              )
            ) {
              const optionItem = targetElement.closest(
                this.getSelectClass(this.selectClasses.classSelectOption)
              );
              this.optionAction(selectItem, originalSelect, optionItem);
            }
        } else if ("focusin" === targetType || "focusout" === targetType) {
          if (
            targetElement.closest(
              this.getSelectClass(this.selectClasses.classSelect)
            )
          )
            "focusin" === targetType
              ? selectItem.classList.add(this.selectClasses.classSelectFocus)
              : selectItem.classList.remove(
                  this.selectClasses.classSelectFocus
                );
        } else if ("keydown" === targetType && "Escape" === e.code)
          this.selectsСlose();
      } else this.selectsСlose();
    }
    selectsСlose(selectOneGroup) {
      const selectsGroup = selectOneGroup ? selectOneGroup : document;
      const selectActiveItems = selectsGroup.querySelectorAll(
        `${this.getSelectClass(
          this.selectClasses.classSelect
        )}${this.getSelectClass(this.selectClasses.classSelectOpen)}`
      );
      if (selectActiveItems.length)
        selectActiveItems.forEach((selectActiveItem) => {
          this.selectСlose(selectActiveItem);
        });
    }
    selectСlose(selectItem) {
      const originalSelect = this.getSelectElement(selectItem).originalSelect;
      const selectOptions = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectOptions
      ).selectElement;
      if (!selectOptions.classList.contains("_slide")) {
        selectItem.classList.remove(this.selectClasses.classSelectOpen);
        _slideUp(selectOptions, originalSelect.dataset.speed);
      }
    }
    selectAction(selectItem) {
      const originalSelect = this.getSelectElement(selectItem).originalSelect;
      const selectOptions = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectOptions
      ).selectElement;
      if (originalSelect.closest("[data-one-select]")) {
        const selectOneGroup = originalSelect.closest("[data-one-select]");
        this.selectsСlose(selectOneGroup);
      }
      if (!selectOptions.classList.contains("_slide")) {
        selectItem.classList.toggle(this.selectClasses.classSelectOpen);
        _slideToggle(selectOptions, originalSelect.dataset.speed);
      }
    }
    setSelectTitleValue(selectItem, originalSelect) {
      const selectItemBody = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectBody
      ).selectElement;
      const selectItemTitle = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectTitle
      ).selectElement;
      if (selectItemTitle) selectItemTitle.remove();
      selectItemBody.insertAdjacentHTML(
        "afterbegin",
        this.getSelectTitleValue(selectItem, originalSelect)
      );
      originalSelect.hasAttribute("data-search")
        ? this.searchActions(selectItem)
        : null;
    }
    getSelectTitleValue(selectItem, originalSelect) {
      let selectTitleValue = this.getSelectedOptionsData(
        originalSelect,
        2
      ).html;
      if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
        selectTitleValue = this.getSelectedOptionsData(originalSelect)
          .elements.map(
            (option) =>
              `<span role="button" data-select-id="${
                selectItem.dataset.id
              }" data-value="${
                option.value
              }" class="_select-tag">${this.getSelectElementContent(
                option
              )}</span>`
          )
          .join("");
        if (
          originalSelect.dataset.tags &&
          document.querySelector(originalSelect.dataset.tags)
        ) {
          document.querySelector(originalSelect.dataset.tags).innerHTML =
            selectTitleValue;
          if (originalSelect.hasAttribute("data-search"))
            selectTitleValue = false;
        }
      }
      selectTitleValue = selectTitleValue.length
        ? selectTitleValue
        : originalSelect.dataset.placeholder
        ? originalSelect.dataset.placeholder
        : "";
      let pseudoAttribute = "";
      let pseudoAttributeClass = "";
      if (originalSelect.hasAttribute("data-pseudo-label")) {
        pseudoAttribute = originalSelect.dataset.pseudoLabel
          ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"`
          : ` data-pseudo-label="Заповніть атрибут"`;
        pseudoAttributeClass = ` ${this.selectClasses.classSelectPseudoLabel}`;
      }
      this.getSelectedOptionsData(originalSelect).values.length
        ? selectItem.classList.add(this.selectClasses.classSelectActive)
        : selectItem.classList.remove(this.selectClasses.classSelectActive);
      if (originalSelect.hasAttribute("data-search"))
        return `<div class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${this.selectClasses.classSelectInput}"></span></div>`;
      else {
        const customClass =
          this.getSelectedOptionsData(originalSelect).elements.length &&
          this.getSelectedOptionsData(originalSelect).elements[0].dataset.class
            ? ` ${
                this.getSelectedOptionsData(originalSelect).elements[0].dataset
                  .class
              }`
            : "";
        return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span${pseudoAttribute} class="${this.selectClasses.classSelectValue}${pseudoAttributeClass}"><span class="${this.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
      }
    }
    getSelectElementContent(selectOption) {
      const selectOptionData = selectOption.dataset.asset
        ? `${selectOption.dataset.asset}`
        : "";
      const selectOptionDataHTML =
        selectOptionData.indexOf("img") >= 0
          ? `<img src="${selectOptionData}" alt="">`
          : selectOptionData;
      let selectOptionContentHTML = ``;
      selectOptionContentHTML += selectOptionData
        ? `<span class="${this.selectClasses.classSelectRow}">`
        : "";
      selectOptionContentHTML += selectOptionData
        ? `<span class="${this.selectClasses.classSelectData}">`
        : "";
      selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : "";
      selectOptionContentHTML += selectOptionData ? `</span>` : "";
      selectOptionContentHTML += selectOptionData
        ? `<span class="${this.selectClasses.classSelectText}">`
        : "";
      selectOptionContentHTML += selectOption.textContent;
      selectOptionContentHTML += selectOptionData ? `</span>` : "";
      selectOptionContentHTML += selectOptionData ? `</span>` : "";
      return selectOptionContentHTML;
    }
    getSelectPlaceholder(originalSelect) {
      const selectPlaceholder = Array.from(originalSelect.options).find(
        (option) => !option.value
      );
      if (selectPlaceholder)
        return {
          value: selectPlaceholder.textContent,
          show: selectPlaceholder.hasAttribute("data-show"),
          label: {
            show: selectPlaceholder.hasAttribute("data-label"),
            text: selectPlaceholder.dataset.label,
          },
        };
    }
    getSelectedOptionsData(originalSelect, type) {
      let selectedOptions = [];
      if (originalSelect.multiple)
        selectedOptions = Array.from(originalSelect.options)
          .filter((option) => option.value)
          .filter((option) => option.selected);
      else
        selectedOptions.push(
          originalSelect.options[originalSelect.selectedIndex]
        );
      return {
        elements: selectedOptions.map((option) => option),
        values: selectedOptions
          .filter((option) => option.value)
          .map((option) => option.value),
        html: selectedOptions.map((option) =>
          this.getSelectElementContent(option)
        ),
      };
    }
    getOptions(originalSelect) {
      let selectOptionsScroll = originalSelect.hasAttribute("data-scroll")
        ? `data-simplebar`
        : "";
      let selectOptionsScrollHeight = originalSelect.dataset.scroll
        ? `style="max-height:${originalSelect.dataset.scroll}px"`
        : "";
      let selectOptions = Array.from(originalSelect.options);
      if (selectOptions.length > 0) {
        let selectOptionsHTML = ``;
        if (
          (this.getSelectPlaceholder(originalSelect) &&
            !this.getSelectPlaceholder(originalSelect).show) ||
          originalSelect.multiple
        )
          selectOptions = selectOptions.filter((option) => option.value);
        selectOptionsHTML += selectOptionsScroll
          ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${this.selectClasses.classSelectOptionsScroll}">`
          : "";
        selectOptions.forEach((selectOption) => {
          selectOptionsHTML += this.getOption(selectOption, originalSelect);
        });
        selectOptionsHTML += selectOptionsScroll ? `</div>` : "";
        return selectOptionsHTML;
      }
    }
    getOption(selectOption, originalSelect) {
      const selectOptionSelected =
        selectOption.selected && originalSelect.multiple
          ? ` ${this.selectClasses.classSelectOptionSelected}`
          : "";
      const selectOptionHide =
        selectOption.selected &&
        !originalSelect.hasAttribute("data-show-selected") &&
        !originalSelect.multiple
          ? `hidden`
          : ``;
      const selectOptionClass = selectOption.dataset.class
        ? ` ${selectOption.dataset.class}`
        : "";
      const selectOptionLink = selectOption.dataset.href
        ? selectOption.dataset.href
        : false;
      const selectOptionLinkTarget = selectOption.hasAttribute(
        "data-href-blank"
      )
        ? `target="_blank"`
        : "";
      let selectOptionHTML = ``;
      selectOptionHTML += selectOptionLink
        ? `<a ${selectOptionLinkTarget} ${selectOptionHide} href="${selectOptionLink}" data-value="${selectOption.value}" class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}">`
        : `<button ${selectOptionHide} class="${this.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
      selectOptionHTML += this.getSelectElementContent(selectOption);
      selectOptionHTML += selectOptionLink ? `</a>` : `</button>`;
      return selectOptionHTML;
    }
    setOptions(selectItem, originalSelect) {
      const selectItemOptions = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectOptions
      ).selectElement;
      selectItemOptions.innerHTML = this.getOptions(originalSelect);
    }
    optionAction(selectItem, originalSelect, optionItem) {
      if (originalSelect.multiple) {
        optionItem.classList.toggle(
          this.selectClasses.classSelectOptionSelected
        );
        const originalSelectSelectedItems =
          this.getSelectedOptionsData(originalSelect).elements;
        originalSelectSelectedItems.forEach((originalSelectSelectedItem) => {
          originalSelectSelectedItem.removeAttribute("selected");
        });
        const selectSelectedItems = selectItem.querySelectorAll(
          this.getSelectClass(this.selectClasses.classSelectOptionSelected)
        );
        selectSelectedItems.forEach((selectSelectedItems) => {
          originalSelect
            .querySelector(
              `option[value="${selectSelectedItems.dataset.value}"]`
            )
            .setAttribute("selected", "selected");
        });
      } else {
        if (!originalSelect.hasAttribute("data-show-selected")) {
          if (
            selectItem.querySelector(
              `${this.getSelectClass(
                this.selectClasses.classSelectOption
              )}[hidden]`
            )
          )
            selectItem.querySelector(
              `${this.getSelectClass(
                this.selectClasses.classSelectOption
              )}[hidden]`
            ).hidden = false;
          optionItem.hidden = true;
        }
        originalSelect.value = optionItem.hasAttribute("data-value")
          ? optionItem.dataset.value
          : optionItem.textContent;
        this.selectAction(selectItem);
      }
      this.setSelectTitleValue(selectItem, originalSelect);
      this.setSelectChange(originalSelect);
    }
    selectChange(e) {
      const originalSelect = e.target;
      this.selectBuild(originalSelect);
      this.setSelectChange(originalSelect);
    }
    setSelectChange(originalSelect) {
      if (originalSelect.hasAttribute("data-validate"))
        formValidate.validateInput(originalSelect);
      if (originalSelect.hasAttribute("data-submit") && originalSelect.value) {
        let tempButton = document.createElement("button");
        tempButton.type = "submit";
        originalSelect.closest("form").append(tempButton);
        tempButton.click();
        tempButton.remove();
      }
      const selectItem = originalSelect.parentElement;
      this.selectCallback(selectItem, originalSelect);
    }
    selectDisabled(selectItem, originalSelect) {
      if (originalSelect.disabled) {
        selectItem.classList.add(this.selectClasses.classSelectDisabled);
        this.getSelectElement(
          selectItem,
          this.selectClasses.classSelectTitle
        ).selectElement.disabled = true;
      } else {
        selectItem.classList.remove(this.selectClasses.classSelectDisabled);
        this.getSelectElement(
          selectItem,
          this.selectClasses.classSelectTitle
        ).selectElement.disabled = false;
      }
    }
    searchActions(selectItem) {
      this.getSelectElement(selectItem).originalSelect;
      const selectInput = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectInput
      ).selectElement;
      const selectOptions = this.getSelectElement(
        selectItem,
        this.selectClasses.classSelectOptions
      ).selectElement;
      const selectOptionsItems = selectOptions.querySelectorAll(
        `.${this.selectClasses.classSelectOption}`
      );
      const _this = this;
      selectInput.addEventListener("input", function () {
        selectOptionsItems.forEach((selectOptionsItem) => {
          if (
            selectOptionsItem.textContent
              .toUpperCase()
              .includes(selectInput.value.toUpperCase())
          )
            selectOptionsItem.hidden = false;
          else selectOptionsItem.hidden = true;
        });
        true === selectOptions.hidden ? _this.selectAction(selectItem) : null;
      });
    }
    selectCallback(selectItem, originalSelect) {
      document.dispatchEvent(
        new CustomEvent("selectCallback", {
          detail: {
            select: originalSelect,
          },
        })
      );
    }
    setLogging(message) {
      this.config.logging ? functions_FLS(`[select]: ${message}`) : null;
    }
  }
  modules_flsModules.select = new SelectConstructor({});
  let addWindowScrollEvent = false;
  setTimeout(() => {
    if (addWindowScrollEvent) {
      let windowScroll = new Event("windowScroll");
      window.addEventListener("scroll", function (e) {
        document.dispatchEvent(windowScroll);
      });
    }
  }, 0);
  class DynamicAdapt {
    constructor(type) {
      this.type = type;
    }
    init() {
      this.оbjects = [];
      this.daClassname = "_dynamic_adapt_";
      this.nodes = [...document.querySelectorAll("[data-da]")];
      this.nodes.forEach((node) => {
        const data = node.dataset.da.trim();
        const dataArray = data.split(",");
        const оbject = {};
        оbject.element = node;
        оbject.parent = node.parentNode;
        оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
        оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
        оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.оbjects.push(оbject);
      });
      this.arraySort(this.оbjects);
      this.mediaQueries = this.оbjects
        .map(
          ({ breakpoint }) =>
            `(${this.type}-width: ${breakpoint}px),${breakpoint}`
        )
        .filter((item, index, self) => self.indexOf(item) === index);
      this.mediaQueries.forEach((media) => {
        const mediaSplit = media.split(",");
        const matchMedia = window.matchMedia(mediaSplit[0]);
        const mediaBreakpoint = mediaSplit[1];
        const оbjectsFilter = this.оbjects.filter(
          ({ breakpoint }) => breakpoint === mediaBreakpoint
        );
        matchMedia.addEventListener("change", () => {
          this.mediaHandler(matchMedia, оbjectsFilter);
        });
        this.mediaHandler(matchMedia, оbjectsFilter);
      });
    }
    mediaHandler(matchMedia, оbjects) {
      if (matchMedia.matches)
        оbjects.forEach((оbject) => {
          this.moveTo(оbject.place, оbject.element, оbject.destination);
        });
      else
        оbjects.forEach(({ parent, element, index }) => {
          if (element.classList.contains(this.daClassname))
            this.moveBack(parent, element, index);
        });
    }
    moveTo(place, element, destination) {
      element.classList.add(this.daClassname);
      if ("last" === place || place >= destination.children.length) {
        destination.append(element);
        return;
      }
      if ("first" === place) {
        destination.prepend(element);
        return;
      }
      destination.children[place].before(element);
    }
    moveBack(parent, element, index) {
      element.classList.remove(this.daClassname);
      if (void 0 !== parent.children[index])
        parent.children[index].before(element);
      else parent.append(element);
    }
    indexInParent(parent, element) {
      return [...parent.children].indexOf(element);
    }
    arraySort(arr) {
      if ("min" === this.type)
        arr.sort((a, b) => {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) return 0;
            if ("first" === a.place || "last" === b.place) return -1;
            if ("last" === a.place || "first" === b.place) return 1;
            return 0;
          }
          return a.breakpoint - b.breakpoint;
        });
      else {
        arr.sort((a, b) => {
          if (a.breakpoint === b.breakpoint) {
            if (a.place === b.place) return 0;
            if ("first" === a.place || "last" === b.place) return 1;
            if ("last" === a.place || "first" === b.place) return -1;
            return 0;
          }
          return b.breakpoint - a.breakpoint;
        });
        return;
      }
    }
  }
  const da = new DynamicAdapt("max");
  da.init();
  document.addEventListener("click", function (e) {
    if (
      e.target.closest(".fullscreen__button") ||
      e.target.closest(".reasons__button")
    )
      document.querySelector(".fullscreen__form").classList.add("_active");
    else if (!e.target.closest(".fullscreen__form"))
      document.querySelector(".fullscreen__form").classList.remove("_active");
  });
  window.addEventListener("DOMContentLoaded", function () {
    [].forEach.call(document.querySelectorAll(".tel"), function (input) {
      var keyCode;
      function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+91 ___ ___ ____",
          i = 0,
          def = matrix.replace(/\D/g, ""),
          val = this.value.replace(/\D/g, ""),
          new_value = matrix.replace(/[_\d]/g, function (a) {
            return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
          });
        i = new_value.indexOf("_");
        if (-1 != i) {
          i < 5 && (i = 3);
          new_value = new_value.slice(0, i);
        }
        var reg = matrix
          .substr(0, this.value.length)
          .replace(/_+/g, function (a) {
            return "\\d{1," + a.length + "}";
          })
          .replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (
          !reg.test(this.value) ||
          this.value.length < 5 ||
          (keyCode > 47 && keyCode < 58)
        )
          this.value = new_value;
        if ("blur" == event.type && this.value.length < 5) this.value = "";
      }
      input.addEventListener("input", mask, false);
      input.addEventListener("focus", mask, false);
      input.addEventListener("blur", mask, false);
      input.addEventListener("keydown", mask, false);
    });
  });
  let map_container = document.getElementById("map_container");
  let options_map = {
    once: true,
    passive: true,
    capture: true,
  };
  map_container.addEventListener("touchstart", start_lazy_map, options_map);
  map_container.addEventListener("touchend", start_lazy_map, options_map);
  map_container.addEventListener("touchcancel", start_lazy_map, options_map);
  map_container.addEventListener("touchmove", start_lazy_map, options_map);
  map_container.addEventListener("click", start_lazy_map, options_map);
  map_container.addEventListener("mouseover", start_lazy_map, options_map);
  let map_loaded = false;
  function start_lazy_map() {
    if (!map_loaded) {
      let map_block = document.getElementById("ymap_lazy");
      map_loaded = true;
      map_block.setAttribute("src", map_block.getAttribute("data-src"));
      map_block.removeAttribute("data-src");
    }
  }
  isWebp();
  menuInit();
})();
