const baseURL = 'https://example.com/data/';// constant base url 
// Keyword categories and their subcategories
    const keywordCategories = {
        'ai': {
            'overview': 'AI Overview',
            'campus': 'AI Campus',
            'courses': 'AI Courses',
            'scholarships': 'AI Scholarships',
            'admission': 'AI Admission',
            'placements': 'AI Placements',
            'results': 'AI Results'
        },
        'php': {
            'overview': 'PHP Overview',
            'campus': 'PHP Campus',
            'courses': 'PHP Courses',
            'scholarships': 'PHP Scholarships',
            'admission': 'PHP Admission',
            'placements': 'PHP Placements',
            'results': 'PHP Results'
        },
        'python': {
            'overview': 'Python Overview',
            'campus': 'Python Campus',
            'courses': 'Python Courses',
            'scholarships': 'Python Scholarships',
            'admission': 'Python Admission',
            'placements': 'Python Placements',
            'results': 'Python Results'
        },
       
    };
    //Handle file upload and processing
    function handleFile() {
        const fileInput = document.getElementById('csvFileInput');
        const dataTable = document.getElementById('dataTable');

        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const content = e.target.result;
                const sanitizedContent = sanitize(content);
                const rows = sanitizedContent.split('\n');
                const categorizedDescriptions = categorizeDescriptions(rows);
                const tableHTML = generateTableHTML(categorizedDescriptions);
                dataTable.innerHTML = tableHTML;
            };

            reader.readAsText(file);
        } else {
            alert('Please select a CSV file.');
        }
    }
    // Categorize URLs and descriptions
    function categorizeDescriptions(rows) {
        const categories = {};

        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].split(',');
            const url = cells[0]; 
            const description = sanitizeInput(cells.slice(1).join(', ')); 

            //Extract category key from relative URL
            const relativeURL = url.replace(baseURL, '');
            const categoryKey = findCategory(relativeURL);

            // Initialize category if not exists
            if (!categories[categoryKey]) {
                categories[categoryKey] = {
                    'overview': { 'url': '', 'descriptions': [] },
                    'campus': { 'descriptions': [] },
                    'courses': { 'descriptions': [] },
                    'scholarships': { 'descriptions': [] },
                    'admission': { 'descriptions': [] },
                    'placements': { 'descriptions': [] },
                    'results': { 'descriptions': [] }
                };
            }
            // Categorize descriptions based on keywords
            for (const keyword in keywordCategories[categoryKey]) {
                if (keywordCategories[categoryKey].hasOwnProperty(keyword)) {
                    const category = categories[categoryKey][keyword];
                    if (relativeURL.includes(keyword.toLowerCase()) && category.url === '') {
                        category.url = baseURL + categoryKey;
                    }
                    if (description.toLowerCase().includes(keyword.toLowerCase())) {
                        category.descriptions.push(description);
                    }
                }
            }
        }

        return categories;
    }

    // Find category based on relative URL
    function findCategory(relativeURL) {
        for (const keyword in keywordCategories) {
            if (keywordCategories.hasOwnProperty(keyword) && relativeURL.includes(keyword)) {
                return keyword;
            }
        }
        return 'Other';// Default category if not found
    }

    // Generate HTML table from categorized descriptions
    function generateTableHTML(categorizedDescriptions) {
        let tableHTML = '<thead><tr><th>URL</th>';


        for (const keyword in keywordCategories['ai']) {
            if (keywordCategories['ai'].hasOwnProperty(keyword)) {
                tableHTML += `<th>${keyword}</th>`;
            }
        }

        tableHTML += '</tr></thead><tbody>';

        // Populate rows with URLs and descriptions
        for (const key in categorizedDescriptions) {
            if (categorizedDescriptions.hasOwnProperty(key)) {
                tableHTML += `<tr><td>${baseURL + key}</td>`;
                for (const keyword in keywordCategories[key]) {
                    if (keywordCategories[key].hasOwnProperty(keyword)) {
                        const category = categorizedDescriptions[key][keyword];
                        tableHTML += `<td>${category.descriptions.join('<br>')}</td>`;
                    }
                }
                tableHTML += '</tr>';
            }
        }

        tableHTML += '</tbody>';
        return tableHTML;
    }

    // Sanitization function to handle irregularities in URLs and titles
    function sanitize(input) {
       
        return input.replace(/[^a-zA-Z0-9\s.,:/]/g, ''); 
    }

    // Sanitization function to handle irregularities in URLs and titles
    function sanitizeInput(input) {
       
        return sanitize(input);
    }