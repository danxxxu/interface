let eleCount = 0;

function addElement(element) {
  eleCount++;
  let eleHtml = `
    <div class="element" onmouseenter="showElementInfo(event, this)" onmouseleave="hideElementInfo(this)">
    <div class="element_info"></div>
    <button class="close" name="delete_element" onclick="deleteElement(this)">X</button>
    <div class="block"><span id="index">#1</span></div>
    <div class="block"><input list="existTypes" id="type" placeholder="Type/role (if applicable)"/><datalist id="existTypes"></datalist></div>
    <div class="block"><input list="eCount" id="ele_num" placeholder="Count"/><datalist id="eCount"><datalist id="eCount">
    <option value="1"></option>
    <option value="2"></option>
    <option value="3"></option>
    <option value="4"></option>
    <option value="5"></option>
    <option value="1+"></option>
    <option value="2+"></option>
    <option value="3+"></option>
    <option value="4+"></option>
    <option value="5+"></option>
  </datalist></datalist></div>
    <div class="allactions">
      <div class="action">
      <button class="close" name="delete_action" onclick="deleteAction(this)">X</button>
        <div class="act_block">
          <label for="actionV" id="actionIn">1</label>
          <input id="actionV" placeholder="Action"/>
        </div>
        <div class="act_block" style="width: 98%;">COMMUNICATION:</div>  
        <div class="com">
              <div class="an_com">
                <div class="ancom_block">To:</div>
                <div class="ancom_block">Means:</div>
                <div class="ancom_block">&nbsp</div>
                <div class="ancom_block">Access:</div>
                <div class="ancom_block">&nbsp</div>
                <div class="ancom_block">Config:</div>
                <div class="ancom_block">Count:</div>
                <div class="ancom_block">Effect:</div>
              </div>  
        <div class="communications">
        <button class="close" id="delete_com" onclick="deleteCom(this)">X</button>
          <div class="block">
          <select id="to" name="to_elements" style="float: left;">
          <option value="">--To which element--</option>
          <option value="1">#1</option>
        </select>
            <span hidden id="comIn">0</span>
          </div>
          <div class="block">
            <input
              type="radio"
              id="direct_means"
              name="` + eleCount + `_means"
              value="direct"
              checked
            /><label for="direct_means">Direct</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="via_means"
              name="` + eleCount + `_means"
              value="via"
            /><label for="via_means">Via </label
            >        <select id="via" name="via_elements">
            <option value="">--Select an element--</option>
            <option value="1">#1</option>
          </select>
          </div>
          <div class="block">
            <input
              type="radio"
              id="public_access"
              name="` + eleCount + `_access"
              value="public"
              checked
            /><label for="public_access">Public</label>
          </div>
          <div class="block">
            <input
              type="radio"
              id="private_access"
              name="` + eleCount + `_access"
              value="private"
            /><label for="private_access">Private</label>
          </div>
          <div class="block">
            <input list="eCount" id="config_from" /><span>to</span
            ><input list="eCount" id="config_to" />
          </div>
          <div class="block"><input list="eCount" id="com_num" /></div>
          <div class="block"><input id="effect" /></div>
        </div>
        </div>
        <div class="add_communication">
        <button
          id="add_com"
          onclick="addCommunication(this)"
        >
          Add communication
        </button>
      </div>
      </div>
      <div class="add_action">
      <button id="add_action" onclick="addAction(this)">
        Add action
      </button>
    </div>
    </div>
  </div> `
  element.parentNode.insertAdjacentHTML("beforebegin", eleHtml);
  updateIndex();
  updateDropdown();
}

function deleteElement(element) {
  element.parentNode.remove();
  updateIndex();
  updateDropdown();
}

function updateIndex() {
  const allElements = document.querySelectorAll(".element");
  for (let i = 0; i < allElements.length; i++) {
    allElements[i].querySelector("#index").innerText = `#` + (i + 1);
  }
}

function updateDropdown() {
  const allElements = document.querySelectorAll(".element");

  allElements.forEach(element => {
    const allCommunications = element.querySelectorAll(".communications");
    allCommunications.forEach(element => {
      const toEle = element.querySelector("#to");
      toEle.innerHTML = `<option value="">--To which element--</option>`;
      const viaEle = element.querySelector("#via");
      viaEle.innerHTML = `<option value="">--Select an element--</option>`;

      for (let i = 0; i < allElements.length; i++) {
        const index = (i + 1).toString();
        toEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
        viaEle.innerHTML += `<option value="` + index + `">#` + index + `</option>`;
      }
    });
  });
}