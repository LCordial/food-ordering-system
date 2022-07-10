function makeIngredientDropdown()
{
    for (i=0;i<ingredients.length;i++)
    {
        var option = document.createElement("option");
        option.innerHTML = ingredients[i].ingredientName;
        option.value = i;
        option.classList.add("ingtr");
        dropdown_ingList.appendChild(option)
    }
}

function AddToIngredientList()
{
    if (currentIlist.includes(dropdown_ingList.value))
    {
        currentIvalues[currentIlist.indexOf(dropdown_ingList.value)] = input_ingAmount.value;
    }
    else
    {
        currentIlist.push(dropdown_ingList.value);
        currentIvalues.push(input_ingAmount.value);
    }
    console.log(currentIlist);
    makeCurrentIngredientList();
}

function makeCurrentIngredientList()
{
    removeElementsByClass("ciSpan");
    for (i=0;i<currentIlist.length;i++) {
        let trow = document.createElement("tr");
        let entrydata = document.createElement("td");
        let deletedata = document.createElement("td");
        let smldelico  = document.createElement("img");

        smldelico.classList.add("delicon");
        smldelico.src = "../img/delete.png";//setting delete image
        smldelico.value = i;//storing the ingredient list name for use in function
        smldelico.addEventListener('click', DeleteCurrentIngredient);


        entrydata.classList.add("noborder")
        trow.classList.add("noborder")
        deletedata.classList.add("noborder")

        let entry =  document.createElement("span");
        entry.innerHTML = `•${ingredients[currentIlist[i]].ingredientName} - ${currentIvalues[i]}${getAmountUnit(ingredients[currentIlist[i]])}`;
        console.log(entry.innerHTML);
        trow.classList.add("ciSpan");
        entrydata.appendChild(entry)
        deletedata.appendChild(smldelico);
        trow.appendChild(entrydata);
        trow.appendChild(deletedata);

        ingListCont.appendChild(trow);

    }

}
function AddIngredientList()
{
    let temparray = [];
    for (i = 0; i < currentIlist.length; i++)
    {
        temparray.push(ingredients[currentIlist[i]]);
    }
    db.collection("ingredientLists").doc(input_ingListName.value).set({
        ingredients: temparray,
        amounts: currentIvalues
    })
     .then(() => {
        console.log("Document successfully written!");
    })
     .catch((error) => {
        console.error("Error writing document: ", error);
    });
    currentIlist.length = 0;
    currentIvalues.length = 0;
    input_ingListName.value = "";
    makeCurrentIngredientList();
}

function displayIngredientLists()
{
    removeElementsByClass("rmIngList");
    for (let i = 0; i < ingredientLists.length; i++)
    {
        let ingContainer = document.createElement("div"); //now table element
        
        ingContainer.classList.add("rmIngList");
        ingContainer.classList.add("ingListContainer");
        ingContainer.classList.add("cflex");

        let deletecolumn = document.createElement("div");
        deletecolumn.classList.add("rflex");

        var delico = document.createElement("img");//delete icon
        delico.classList.add("delicon");
        delico.src = "../img/delete.png";//setting delete image
        delico.value = ingredientLists[i].ingredientListName;//storing the ingredient list name for use in function
        delico.addEventListener('click', DeleteIngredientList);//runs delete ingredient list when delico is clicked
        
        let ingListHeader = document.createElement("h5");
        ingListHeader.innerHTML = ingredientLists[i].ingredientListName;
        deletecolumn.appendChild(ingListHeader);
        deletecolumn.appendChild(delico);
        ingContainer.appendChild(deletecolumn);

        for (let j = 0; j < ingredientLists[i].information.ingredients.length; j++)
        {
            let line = document.createElement("span");
            line.innerHTML = `•${ingredientLists[i].information.ingredients[j].ingredientName} - ${ingredientLists[i].information.amounts[j]}${getAmountUnit(ingredientLists[i].information.ingredients[j])} `;
            ingContainer.appendChild(line);
        }
        fullIngListCont.appendChild(ingContainer);
    }
}

var DeleteIngredientList = function ()
{
   db.collection("ingredientLists").doc(this.value).delete().then(() => { 
        //runs on success
      console.log(this.value + "successfully deleted!");
  }).catch((error) => {
        //runs on failure
      console.error("Error removing document: ", error);
  });
}

var DeleteCurrentIngredient = function ()
{
    console.log(this.value);
    currentIlist.splice(parseInt(this.value), 1);
    currentIvalues.splice(parseInt(this.value), 1);
    makeCurrentIngredientList();
}