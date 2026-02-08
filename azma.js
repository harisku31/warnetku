let tabCount = 0;
    const SPEED = 458; // ms -> 1 detik timer (setengah detik nyata)

    function addTab() {
      tabCount++;
      const tab = document.createElement("div");
      tab.className = "tab";
      tab.innerHTML = `
        <h4>Tab ${tabCount}</h4>
        <label>Nama: <input type="text" class="nama"></label>
        <label>Kelas: <input type="text" class="kelas"></label>
        <label>No. Meja: <input type="number" class="meja"></label>
        <label>Jam: <input type="number" class="jam" min="0" value="0"></label>
        <label>Menit: <input type="number" class="menit" min="0" max="59" value="0"></label>
        <label>Detik: <input type="number" class="detik" min="0" max="59" value="10"></label>
        <div class="btnGroup">
          <button class="startBtn" onclick="toggleTimer(this)">Mulai</button>
          <button class="resetBtn" onclick="resetTab(this)">Reset</button>
        </div>
        <div class="timeDisplay">00:00:10</div>
      `;
      document.getElementById("tabs").appendChild(tab);
      enableArrowNavigation(tab);
    }

    function enableArrowNavigation(tab) {
      const inputs = tab.querySelectorAll("input");
      const startBtn = tab.querySelector(".startBtn");
      inputs.forEach((input, index) => {
        input.addEventListener("keydown", (e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (index + 1 < inputs.length) inputs[index + 1].focus();
            else startBtn.focus();
          }
          if (e.key === "ArrowUp") {
            e.preventDefault();
            if (index - 1 >= 0) inputs[index - 1].focus();
          }
        });
      });
      startBtn.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          inputs[inputs.length - 1].focus();
        }
      });
    }

    function scrollTabs(direction) {
      const tabs = document.getElementById("tabs");
      const tabWidth = 315;
      tabs.scrollBy({ left: direction * tabWidth * 3, behavior: "smooth" });
    }

    function toggleTimer(btn) {
      const tab = btn.closest(".tab");
      const display = tab.querySelector(".timeDisplay");
      const alarm = document.getElementById("alarmSound");

      if (btn.classList.contains("stopBtn")) {
        clearInterval(tab.timerInterval);
        tab.timerInterval = null;
        btn.textContent = "Mulai";
        btn.className = "startBtn";
        return;
      }

      let totalSeconds;
      if (tab.remainingSeconds !== undefined) {
        totalSeconds = tab.remainingSeconds;
      } else {
        let jam = parseInt(tab.querySelector(".jam").value) || 0;
        let menit = parseInt(tab.querySelector(".menit").value) || 0;
        let detik = parseInt(tab.querySelector(".detik").value) || 0;
        totalSeconds = jam*3600 + menit*60 + detik;
      }

      function updateDisplay() {
        let h = String(Math.floor(totalSeconds / 3600)).padStart(2,'0');
        let m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2,'0');
        let s = String(totalSeconds % 60).padStart(2,'0');
        display.textContent = `${h}:${m}:${s}`;
      }

      updateDisplay();
      btn.textContent = "Stop";
      btn.className = "stopBtn";

      tab.timerInterval = setInterval(()=>{
        totalSeconds--;
        tab.remainingSeconds = totalSeconds;
        updateDisplay();
        if(totalSeconds <= 0){
          clearInterval(tab.timerInterval);
          tab.timerInterval = null;
          tab.classList.add("finished");
          btn.textContent = "Mulai";
          btn.className = "startBtn";
          delete tab.remainingSeconds;
          let soundCount = 0;
          function playSound() {
            if (soundCount < 5) {
              alarm.currentTime = 0;
              alarm.play();
              soundCount++;
            }
          }
          playSound();
          alarm.onended = () => { playSound(); };
        }
      }, SPEED);
    }

    function resetTab(btn) {
      const tab = btn.closest(".tab");
      const alarm = document.getElementById("alarmSound");
      if (tab.timerInterval) clearInterval(tab.timerInterval);
      tab.timerInterval = null;
      delete tab.remainingSeconds;
      alarm.pause(); alarm.currentTime = 0; alarm.onended = null;
      tab.querySelector(".nama").value = "";
      tab.querySelector(".kelas").value = "";
      tab.querySelector(".meja").value = "";
      tab.querySelector(".jam").value = 0;
      tab.querySelector(".menit").value = 0;
      tab.querySelector(".detik").value = 10;
      tab.querySelector(".timeDisplay").textContent = "00:00:10";
      const startBtn = tab.querySelector(".startBtn, .stopBtn");
      startBtn.textContent = "Mulai"; startBtn.className = "startBtn";
      tab.classList.remove("finished");
    }

    document.getElementById("searchInput").addEventListener("input", function() {
      const keyword = this.value.toLowerCase();
      const tabs = document.querySelectorAll(".tab");
      tabs.forEach(tab => {
        const nama = tab.querySelector(".nama").value.toLowerCase();
        if (nama.includes(keyword)) tab.style.display = "";
        else tab.style.display = "none";
      });
    });