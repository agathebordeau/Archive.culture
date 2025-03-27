document.addEventListener("DOMContentLoaded", function () {
    function updateScrollButtons() {
        setTimeout(() => {
            requestAnimationFrame(() => {
                document.querySelectorAll(".filter-group").forEach(group => {
                    const flexItemRight = group.closest(".flex-item-right");
                    const hellDiv = group.querySelector(".hell");
                    const scrollBtns = group.querySelectorAll(".scroll-btn");
                    const filterScroll = group.querySelector(".filter-scroll");
                    
                    if (hellDiv && flexItemRight && hellDiv.offsetWidth < flexItemRight.offsetWidth) { 
                        scrollBtns.forEach(btn => btn.style.display = "none");
                    } else {
                        scrollBtns.forEach(btn => btn.style.display = "block");
                    }
                });
            });
        }, 100);
    }

    const observer = new MutationObserver(updateScrollButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    
    window.addEventListener("load", updateScrollButtons);
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
});



const hex = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','F'];

document.addEventListener("DOMContentLoaded", () => {
  let randomColor = "#";

  for (let i = 0; i < 6; i++) {
    randomColor += hex[getRandomNumber()];
  }

  document.documentElement.style.setProperty('--filter-bg-color', randomColor);
});

function getRandomNumber() {
  return Math.floor(Math.random() * hex.length);
}






window.app = new Vue({
    el: '#app',
    data: {
        sheetData: [],
        filters: [],
        selectedFilters: [],
        filteredData: [],
        columnNames: [],
        availableFilters: {},
        selectedRowIndex: null
    },
    created() {
      try {
        this.fetchData();
        console.log("created : fetchdata",  this.fetchData);
        console.log("created : availableFilters après montage :", this.availableFilters);
         } catch (error) {
    console.error("Erreur created() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
    },
  
    methods: {
      
        fetchData() {
          try {
            fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS1y9iHpgx5LXIzC1Kd9SfIvY8d8mx996Z5oFC_auiKRpGtc9DBfCWRfq6ZbLGGqyFppPdNOB4Xz_e2/pub?output=csv')
                .then(response => response.text())
                .then(data => {
                    this.processData(data);
                })
                .catch(error => console.error('Erreur lors de la récupération des données:', error.message, error.stack));
           } catch (error) {
    console.error("Erreur fetchData:", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
      
        processData(data) {
            try {
                const rows = data.split('\n').map(row => row.split(','));
                this.columnNames = (rows[0] || []).map(name => name.trim());
                this.sheetData = rows.slice(1);
                this.extractFilters();
                this.filteredData = [...this.sheetData];
                this.updateAvailableFilters();
              console.log('processData : nom colonnes', this.columnNames);
              console.log('processData : sheetData', this.sheetData);
              console.log('processData : updateAvailableFilters', this.updateAvailableFilters);
            } catch (error) {
    console.error("Erreur processData() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
      
        extractFilters() {
            try { 
                this.filters = this.columnNames
                    .filter(category => category !== "Numéro" && category !== "IMG" && category !== "CONTENU")
                    .map(category => {
                        const realIndex = this.columnNames.indexOf(category);
                        const filters = this.sheetData.map(row => row[realIndex] || '').flatMap(cell => cell.split(';'));
                        return {
                            category: category,
                            filters: [...new Set(filters.filter(Boolean))]
                        };
                    });  console.log('extractFilters : filters', this.filters);         
           } catch (error) {
    console.error("Erreur extractFilters() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
        getColumnData(row, columnName) {
            try {
                const index = this.columnNames.indexOf(columnName);
                if (index === -1 || !row[index]) return [];
                return row[index]?.split(';').map(item => item.trim()) || [];
              console.log('getColumnData : filters', this.columnNames.indexOf);    
            } catch (error) {
    console.error("Erreur getColumnData() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
      
        toggleFilter(filter) {
           try {
            let filterExists = Object.values(this.availableFilters).some(set => set.has(filter));
            if (!filterExists) return;
            const index = this.selectedFilters.indexOf(filter);
            if (index === -1) {
                this.selectedFilters.push(filter);
            } else {
                this.selectedFilters.splice(index, 1);
            }
            this.updateFilteredData();
          console.log('toggleFilter');
              } catch (error) {
    console.error("Erreur toggleFilter() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
      
        updateFilteredData() {
          console.log('updateFilteredData : filteredData', this.filteredData);
            try {
                if (this.selectedFilters.length === 0) {
                    this.filteredData = [...this.sheetData];
                } else {
                    this.filteredData = this.sheetData.filter(row =>
                        this.selectedFilters.every(filter => row.some(cell => cell.includes(filter)))
                    );
                }
                this.updateAvailableFilters();
           } catch (error) {
    console.error("Erreur updateFilterdData :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
      
      
        updateAvailableFilters() {
  try {
    const available = {};
    this.filteredData.forEach(row => {
      this.columnNames.forEach((column, colIndex) => {
        if (!available[column]) {
          available[column] = new Set();
        }
        const cellValue = row[colIndex];
        if (cellValue) {
          cellValue.split(';').forEach(value => {
            const trimmedValue = value.trim();
            available[column].add(trimmedValue);
          });
        }
      });
    });
    this.availableFilters = {};
    this.$nextTick(() => {
      this.availableFilters = available;
    });
  } catch (error) {
    console.error("Erreur updateAvailableFilters() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
  }
},
        isFilterDisabled(filter, category) {
          try {
            return !(this.availableFilters[category] && this.availableFilters[category].has(filter));
         } catch (error) {
    console.error("Erreur isFilterDisabled :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
},
      
      
        resetFilters(category) {
            try {
            this.selectedFilters = this.selectedFilters.filter(f =>
                !this.filters.find(group => group.category === category)?.filters.includes(f)
            );
            this.updateFilteredData();
              } catch (error) {
    console.error("Erreur resetFiltersFilters() :", error);
    console.error("Stack trace :", error.stack);
    console.error("Objet d'erreur complet :", JSON.stringify(error, Object.getOwnPropertyNames(error)));
}
        },
      
            hasActiveFilters(category) {
    return this.filters.find(group => group.category === category)?.filters.some(f => this.selectedFilters.includes(f));
},
        
      isSelected(filter) {
      return this.selectedFilters.includes(filter);
    },
      
      
        openModal(rowIndex) {
            this.selectedRowIndex = rowIndex;
            this.$nextTick(() => {
                document.getElementById("myModal").style.display = "flex";
                document.body.classList.add("no-scroll");
            });
        },
        closeModal() {
            this.selectedRowIndex = null;
            document.getElementById("myModal").style.display = "none";
            document.body.classList.remove("no-scroll");
        },
      scrollLeft(index) {
            const refName = "filterScroll" + index;
            if (this.$refs[refName]) {
                this.$refs[refName][0].scrollBy({ left: -150, behavior: "smooth" });
            }
        },
        scrollRight(index) {
            const refName = "filterScroll" + index;
            if (this.$refs[refName]) {
                this.$refs[refName][0].scrollBy({ left: 150, behavior: "smooth" });
            }
        }
    }
});
