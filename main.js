document.addEventListener("DOMContentLoaded", () => {
    // 1. Check for missing library fallbacks
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    const hasLenis = typeof Lenis !== 'undefined';
    const hasVanillaTilt = typeof VanillaTilt !== 'undefined';

    if (!hasGSAP) {
        // Fallback: make all opacity-hidden items visible if GSAP failed to load
        document.querySelectorAll('.hero-subtitle, .hero-title, .hero-tagline, .hero-intro, .hero-ctas, .hero-visual').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        console.warn("GSAP libraries not loaded. Fallbacks triggered.");
    }

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Custom Cursor Follower (Desktop Only)
    const cursor = document.querySelector(".custom-cursor");
    const follower = document.querySelector(".custom-cursor-follower");

    if (window.innerWidth > 768 && cursor && follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the main dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth follower animation loop
        const updateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();

        // Mouse hover expansions
        const hoverables = document.querySelectorAll("a, button, .timeline-card, .interest-card, .gallery-item, .menu-toggle, .ncc-flow-step, .ncc-gallery-card, .ncc-skill-card, .ncc-achievement-item, .moment-slide");
        hoverables.forEach(item => {
            item.addEventListener("mouseenter", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
                cursor.style.backgroundColor = "rgba(110, 139, 116, 0.15)";
                follower.style.transform = "translate(-50%, -50%) scale(1.4)";
                follower.style.borderColor = "var(--highlight)";
            });
            item.addEventListener("mouseleave", () => {
                cursor.style.transform = "translate(-50%, -50%) scale(1)";
                cursor.style.backgroundColor = "var(--highlight)";
                follower.style.transform = "translate(-50%, -50%) scale(1)";
                follower.style.borderColor = "var(--accent-sage)";
            });
        });
    }

    // 4. Initialize Lenis Smooth Scroll (Safeguarded)
    let lenis;
    if (hasLenis) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        // Notify GSAP ScrollTrigger to update positions on Lenis scroll
        if (hasGSAP && hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        // Single, unified high-resolution rendering loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 5. Mobile Menu Toggle
    const menuToggle = document.getElementById("menu-toggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            navLinksContainer.classList.toggle("active");
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                menuToggle.classList.remove("active");
                navLinksContainer.classList.remove("active");
            });
        });
    }

    // 6. Header Scroll Effect
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    // 7. Active Nav Link sync based on Filename
    let activePath = window.location.pathname.split("/").pop();
    if (activePath === "" || activePath === "index.html") {
        activePath = "index.html";
    }
    
    navLinks.forEach(link => {
        link.classList.remove("active");
        const linkHref = link.getAttribute("href");
        if (linkHref === activePath) {
            link.classList.add("active");
        }
    });

    // 8. GSAP Page Entrance Animations (Immediate Load, No ScrollTrigger Required)
    if (hasGSAP) {
        // Hero Entrance Animation (Home Only)
        if (document.querySelector(".hero-section")) {
            const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
            heroTl.to(".hero-subtitle", { opacity: 1, y: 0, delay: 0.2 })
                  .to(".hero-title", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-tagline", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-intro", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-ctas", { opacity: 1, y: 0 }, "-=0.8")
                  .to(".hero-visual", { opacity: 1, scale: 1 }, "-=0.9");
        }

        // NCC Entrance Animation (NCC Only)
        if (document.querySelector(".ncc-hero-sec")) {
            const nccTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
            nccTl.to(".ncc-hero-text .hero-subtitle", { opacity: 1, y: 0, delay: 0.2 })
                 .to(".ncc-hero-text .hero-title", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .hero-tagline", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .ncc-intro-box", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-hero-text .ncc-ctas-inline", { opacity: 1, y: 0 }, "-=0.8")
                 .to(".ncc-portrait-container", { opacity: 1, scale: 1 }, "-=0.9");
        }
    }

    // 9. NATIVE INTERSECTION OBSERVER SCROLL REVEALS
    // Completely replaces ScrollTrigger for scroll-based reveals, making them immune to late image loads
    const revealTargets = document.querySelectorAll(
        '.story-heading-block, .story-text-block p, .timeline-card, .interest-card, .skill-item, ' +
        '.ncc-flow-step, .ncc-gallery-card, .ncc-skill-card, .ncc-achievement-item, .moment-slide, ' +
        '.dreams-list li, .quote-card, .gallery-item, .contact-info-item, .contact-form, .ncc-quote-block, .motto-block'
    );

    if ('IntersectionObserver' in window && revealTargets.length > 0) {
        // Set initial invisible styles
        revealTargets.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(35px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Trigger fade and slide up
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    
                    // Stop observing once animated
                    obs.unobserve(el);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -40px 0px" // Trigger slightly before crossing the viewport
        });

        revealTargets.forEach(el => revealObserver.observe(el));
    } else {
        // Observer not supported fallback (make all visible immediately)
        revealTargets.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    }

    // 10. Skill Bars Width Loading (IntersectionObserver synced)
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if ('IntersectionObserver' in window && skillBars.length > 0) {
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            bar.style.transition = 'width 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
        });

        const barObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.width = bar.getAttribute('data-progress');
                    obs.unobserve(bar);
                }
            });
        }, {
            threshold: 0.1
        });

        skillBars.forEach(bar => barObserver.observe(bar));
    } else {
        // Fallback
        skillBars.forEach(bar => {
            bar.style.width = bar.getAttribute('data-progress');
        });
    }

    // 11. Initialize Vanilla Tilt (for cards, safeguarded)
    if (hasVanillaTilt && window.innerWidth > 768) {
        const tiltElements = document.querySelectorAll("[data-tilt]");
        if (tiltElements.length > 0) {
            VanillaTilt.init(Array.from(tiltElements), {
                max: 10,
                speed: 400,
                glare: true,
                "max-glare": 0.15,
            });
        }
    }

    // 13. ACADEMIC LAB ASSIGNMENTS INTERACTIVE MODULES (ASSIGNMENTS 1 - 9)
    if (document.querySelector(".page-assignments") || document.getElementById("assignmentTabList")) {
        // --- A. Tab Switching Logic ---
        const tabButtons = document.querySelectorAll(".assignment-tab-btn");
        const tabPanes = document.querySelectorAll(".assignment-pane");

        function activateTab(tabId) {
            tabButtons.forEach(btn => {
                if (btn.getAttribute("data-tab") === tabId) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });

            tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    pane.classList.add("active");
                } else {
                    pane.classList.remove("active");
                }
            });

            // Re-render Lucide icons on tab change
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }

        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                activateTab(targetTab);
                window.location.hash = targetTab;
            });
        });

        // Hash navigation support on load
        if (window.location.hash) {
            const hashTab = window.location.hash.substring(1);
            if (document.getElementById(hashTab)) {
                activateTab(hashTab);
            }
        }

        // --- B. Assignment 3: Student Result Management System ---
        const studentResultForm = document.getElementById("studentResultForm");
        const resultTableBody = document.getElementById("resultTableBody");
        const topperNameDisplay = document.getElementById("topperNameDisplay");
        const topperRollDisplay = document.getElementById("topperRollDisplay");
        const topperPercentDisplay = document.getElementById("topperPercentDisplay");
        const searchResultInput = document.getElementById("searchResultInput");
        const btnClearAllResults = document.getElementById("btnClearAllResults");
        const btnResetResultDemo = document.getElementById("btnResetResultDemo");

        let studentRecords = [
            {
                id: 1,
                name: "Bharvi Bhangale",
                rollNo: "24IT101",
                branch: "IT",
                m1: 96, m2: 94, m3: 92, m4: 97, m5: 98,
                total: 477,
                percentage: 95.40,
                grade: "O",
                status: "Pass"
            },
            {
                id: 2,
                name: "Aditya Deshmukh",
                rollNo: "24IT102",
                branch: "IT",
                m1: 88, m2: 85, m3: 90, m4: 86, m5: 92,
                total: 441,
                percentage: 88.20,
                grade: "A+",
                status: "Pass"
            },
            {
                id: 3,
                name: "Sneha Patil",
                rollNo: "24IT103",
                branch: "IT",
                m1: 76, m2: 82, m3: 79, m4: 80, m5: 76,
                total: 393,
                percentage: 78.60,
                grade: "A",
                status: "Pass"
            },
            {
                id: 4,
                name: "Rohan Kulkarni",
                rollNo: "24IT104",
                branch: "IT",
                m1: 65, m2: 60, m3: 58, m4: 64, m5: 63,
                total: 310,
                percentage: 62.00,
                grade: "B+",
                status: "Pass"
            },
            {
                id: 5,
                name: "Neha Verma",
                rollNo: "24IT105",
                branch: "IT",
                m1: 35, m2: 70, m3: 65, m4: 55, m5: 60,
                total: 285,
                percentage: 57.00,
                grade: "F",
                status: "Fail"
            }
        ];

        function calculateGrade(percentage, isFailed) {
            if (isFailed) return "F";
            if (percentage >= 85) return "O";
            if (percentage >= 75) return "A+";
            if (percentage >= 65) return "A";
            if (percentage >= 55) return "B+";
            if (percentage >= 50) return "B";
            return "C";
        }

        function renderStudentResults(recordsToRender = studentRecords) {
            if (!resultTableBody) return;

            // Find Batch Topper (highest percentage)
            let topper = null;
            if (studentRecords.length > 0) {
                topper = [...studentRecords].sort((a, b) => b.percentage - a.percentage)[0];
            }

            if (topper && topperNameDisplay) {
                topperNameDisplay.textContent = topper.name;
                topperRollDisplay.textContent = topper.rollNo;
                topperPercentDisplay.textContent = `${topper.percentage.toFixed(2)}% (${topper.grade} Grade)`;
            }

            resultTableBody.innerHTML = "";

            if (recordsToRender.length === 0) {
                resultTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-3 text-muted">No student records match search criteria.</td></tr>`;
                return;
            }

            recordsToRender.forEach(student => {
                const isTopper = topper && student.id === topper.id;
                const tr = document.createElement("tr");
                if (isTopper) tr.classList.add("table-warning");

                tr.innerHTML = `
                    <td><strong>${student.rollNo}</strong></td>
                    <td>
                        ${student.name}
                        ${isTopper ? '<span class="badge-topper-row">🏆 Topper</span>' : ''}
                    </td>
                    <td><strong>${student.total}</strong> / 500</td>
                    <td><span class="fw-bold">${student.percentage.toFixed(2)}%</span></td>
                    <td><span class="badge ${student.grade === 'O' ? 'badge-grade-o' : student.grade === 'A+' || student.grade === 'A' ? 'badge-grade-a' : student.grade === 'F' ? 'badge-grade-f' : 'badge-grade-b'}">${student.grade}</span></td>
                    <td><span class="${student.status === 'Pass' ? 'badge-pass' : 'badge-fail'}">${student.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger py-0 px-2 delete-result-btn" data-id="${student.id}" title="Delete Record">✕</button>
                    </td>
                `;

                resultTableBody.appendChild(tr);
            });

            // Bind Delete Buttons
            document.querySelectorAll(".delete-result-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const idToDelete = Number(btn.getAttribute("data-id"));
                    studentRecords = studentRecords.filter(r => r.id !== idToDelete);
                    renderStudentResults();
                });
            });
        }

        if (studentResultForm) {
            studentResultForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const name = document.getElementById("resStudentName").value.trim();
                const rollNo = document.getElementById("resRollNo").value.trim().toUpperCase();
                const branch = document.getElementById("resBranch").value.trim();
                const m1 = Number(document.getElementById("resM1").value);
                const m2 = Number(document.getElementById("resM2").value);
                const m3 = Number(document.getElementById("resM3").value);
                const m4 = Number(document.getElementById("resM4").value);
                const m5 = Number(document.getElementById("resM5").value);

                const total = m1 + m2 + m3 + m4 + m5;
                const percentage = Number((total / 5).toFixed(2));
                const isFailed = [m1, m2, m3, m4, m5].some(m => m < 40);
                const status = isFailed ? "Fail" : "Pass";
                const grade = calculateGrade(percentage, isFailed);

                const newRecord = {
                    id: Date.now(),
                    name,
                    rollNo,
                    branch,
                    m1, m2, m3, m4, m5,
                    total,
                    percentage,
                    grade,
                    status
                };

                studentRecords.unshift(newRecord);
                renderStudentResults();
                studentResultForm.reset();
                document.getElementById("resBranch").value = "IT";
            });
        }

        if (searchResultInput) {
            searchResultInput.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = studentRecords.filter(s => 
                    s.name.toLowerCase().includes(query) || s.rollNo.toLowerCase().includes(query)
                );
                renderStudentResults(filtered);
            });
        }

        if (btnClearAllResults) {
            btnClearAllResults.addEventListener("click", () => {
                if (confirm("Are you sure you want to clear all student records?")) {
                    studentRecords = [];
                    renderStudentResults();
                }
            });
        }

        if (btnResetResultDemo) {
            btnResetResultDemo.addEventListener("click", () => {
                document.getElementById("resStudentName").value = "Aarav Sharma";
                document.getElementById("resRollNo").value = "24IT106";
                document.getElementById("resM1").value = 91;
                document.getElementById("resM2").value = 89;
                document.getElementById("resM3").value = 94;
                document.getElementById("resM4").value = 88;
                document.getElementById("resM5").value = 92;
            });
        }

        renderStudentResults();

        // --- C. Assignment 4: Employee Registration Form Validation ---
        const empForm = document.getElementById("employeeRegForm");
        const empName = document.getElementById("empName");
        const empEmail = document.getElementById("empEmail");
        const empPhone = document.getElementById("empPhone");
        const empPassword = document.getElementById("empPassword");
        const empConfirmPassword = document.getElementById("empConfirmPassword");
        const empDept = document.getElementById("empDept");
        const empJoinDate = document.getElementById("empJoinDate");
        const pwdStrengthBar = document.getElementById("pwdStrengthBar");
        const employeeListContainer = document.getElementById("employeeListContainer");

        function setFeedback(inputEl, feedbackEl, isValid, message) {
            if (isValid) {
                inputEl.classList.remove("is-invalid");
                inputEl.classList.add("is-valid");
                feedbackEl.className = "custom-feedback success";
                feedbackEl.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;"></i> ${message || 'Valid'}`;
            } else {
                inputEl.classList.remove("is-valid");
                inputEl.classList.add("is-invalid");
                feedbackEl.className = "custom-feedback error";
                feedbackEl.innerHTML = `<i data-lucide="alert-circle" style="width:14px;height:14px;"></i> ${message}`;
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }

        // Live validation rules
        if (empName) {
            empName.addEventListener("input", () => {
                const val = empName.value.trim();
                const nameRegex = /^[a-zA-Z\s]{3,40}$/;
                const isValid = nameRegex.test(val);
                setFeedback(empName, document.getElementById("empNameFeedback"), isValid, isValid ? "Looks good!" : "Name must be letters & spaces only (min 3 characters)");
            });
        }

        if (empEmail) {
            empEmail.addEventListener("input", () => {
                const val = empEmail.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = emailRegex.test(val);
                setFeedback(empEmail, document.getElementById("empEmailFeedback"), isValid, isValid ? "Valid email format" : "Please provide a valid email (e.g. name@domain.com)");
            });
        }

        if (empPhone) {
            empPhone.addEventListener("input", () => {
                const val = empPhone.value.trim();
                const phoneRegex = /^[6-9]\d{9}$/;
                const isValid = phoneRegex.test(val);
                setFeedback(empPhone, document.getElementById("empPhoneFeedback"), isValid, isValid ? "Valid 10-digit mobile number" : "Must be 10 digits starting with 6, 7, 8, or 9");
            });
        }

        if (empPassword) {
            empPassword.addEventListener("input", () => {
                const val = empPassword.value;
                let score = 0;
                if (val.length >= 8) score++;
                if (/[A-Z]/.test(val)) score++;
                if (/[0-9]/.test(val)) score++;
                if (/[@$!%*?&]/.test(val)) score++;

                if (pwdStrengthBar) {
                    if (score <= 1) {
                        pwdStrengthBar.style.width = "25%";
                        pwdStrengthBar.style.backgroundColor = "#d32f2f";
                    } else if (score === 2 || score === 3) {
                        pwdStrengthBar.style.width = "65%";
                        pwdStrengthBar.style.backgroundColor = "#ff9800";
                    } else {
                        pwdStrengthBar.style.width = "100%";
                        pwdStrengthBar.style.backgroundColor = "#2e7d32";
                    }
                }

                const isValid = score >= 4 && val.length >= 8;
                setFeedback(empPassword, document.getElementById("empPasswordFeedback"), isValid, isValid ? "Strong password criteria satisfied!" : "Requires 8+ chars with uppercase, digit, and special symbol (@$!%*?&)");
            });
        }

        if (empConfirmPassword) {
            empConfirmPassword.addEventListener("input", () => {
                const isValid = empConfirmPassword.value === empPassword.value && empConfirmPassword.value.length > 0;
                setFeedback(empConfirmPassword, document.getElementById("empConfirmPasswordFeedback"), isValid, isValid ? "Passwords match!" : "Passwords do not match");
            });
        }

        if (empForm) {
            empForm.addEventListener("submit", (e) => {
                e.preventDefault();

                const isNameValid = /^[a-zA-Z\s]{3,40}$/.test(empName.value.trim());
                const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empEmail.value.trim());
                const isPhoneValid = /^[6-9]\d{9}$/.test(empPhone.value.trim());
                const isPwdValid = empPassword.value.length >= 8 && /[A-Z]/.test(empPassword.value) && /[0-9]/.test(empPassword.value) && /[@$!%*?&]/.test(empPassword.value);
                const isConfirmValid = empConfirmPassword.value === empPassword.value;
                const isDeptValid = empDept.value !== "";
                const isDateValid = empJoinDate.value !== "";

                if (isNameValid && isEmailValid && isPhoneValid && isPwdValid && isConfirmValid && isDeptValid && isDateValid) {
                    // Create employee card
                    const newEmpCard = document.createElement("div");
                    newEmpCard.className = "p-3 rounded-3 bg-light border";
                    newEmpCard.innerHTML = `
                        <div class="d-flex justify-content-between align-items-center">
                            <strong>${empName.value.trim()}</strong>
                            <span class="badge bg-success-subtle text-success">${empDept.value}</span>
                        </div>
                        <div class="small text-muted mt-1">${empEmail.value.trim()} • +91 ${empPhone.value.trim()}</div>
                        <div class="small text-secondary mt-1">Joined: ${empJoinDate.value}</div>
                    `;
                    employeeListContainer.prepend(newEmpCard);

                    alert("✅ Employee Registered Successfully with full validation!");
                    empForm.reset();
                    if (pwdStrengthBar) pwdStrengthBar.style.width = "0%";
                    document.querySelectorAll(".custom-feedback").forEach(el => el.innerHTML = "");
                    document.querySelectorAll(".form-control").forEach(el => el.classList.remove("is-valid", "is-invalid"));
                } else {
                    alert("⚠️ Please resolve all form errors highlighted in red before submission.");
                }
            });
        }

        // --- D. Assignment 8: In-Browser REST API Explorer Console ---
        const apiMethodSelect = document.getElementById("apiMethodSelect");
        const apiUrlInput = document.getElementById("apiUrlInput");
        const apiPayloadContainer = document.getElementById("apiPayloadContainer");
        const apiPayloadEditor = document.getElementById("apiPayloadEditor");
        const btnSendApiRequest = document.getElementById("btnSendApiRequest");
        const apiResponseStatus = document.getElementById("apiResponseStatus");
        const apiResponseTime = document.getElementById("apiResponseTime");
        const apiResponseWindow = document.getElementById("apiResponseWindow");

        if (apiMethodSelect && apiPayloadContainer) {
            apiMethodSelect.addEventListener("change", (e) => {
                const method = e.target.value;
                if (method === "POST" || method === "PUT") {
                    apiPayloadContainer.style.display = "block";
                } else {
                    apiPayloadContainer.style.display = "none";
                }
            });
        }

        if (btnSendApiRequest) {
            btnSendApiRequest.addEventListener("click", () => {
                const method = apiMethodSelect.value;
                const url = apiUrlInput.value.trim();
                const startTime = performance.now();

                let responseData = {};
                let statusCode = 200;
                let statusText = "200 OK";

                try {
                    if (url.startsWith("/api/students")) {
                        if (method === "GET") {
                            responseData = {
                                success: true,
                                count: studentRecords.length,
                                topper: studentRecords.length > 0 ? {
                                    name: studentRecords[0].name,
                                    rollNumber: studentRecords[0].rollNo,
                                    percentage: studentRecords[0].percentage
                                } : null,
                                data: studentRecords
                            };
                            statusCode = 200;
                            statusText = "200 OK";
                        } else if (method === "POST") {
                            const body = JSON.parse(apiPayloadEditor.value);
                            const total = Object.values(body.marks || {}).reduce((a, b) => Number(a) + Number(b), 0);
                            const percentage = Number((total / 5).toFixed(2));
                            const newStudent = {
                                _id: "665c7a" + Math.floor(100000 + Math.random() * 900000),
                                rollNumber: body.rollNumber || "24IT999",
                                name: body.name || "Test Student",
                                email: body.email || "test@kbtcoe.edu.in",
                                department: body.department || "Information Technology",
                                marks: body.marks,
                                totalMarks: total,
                                percentage: percentage,
                                grade: percentage >= 85 ? "O" : percentage >= 75 ? "A+" : "A",
                                status: "Pass",
                                createdAt: new Date().toISOString()
                            };
                            responseData = {
                                success: true,
                                message: "Student record created successfully in MongoDB",
                                data: newStudent
                            };
                            statusCode = 201;
                            statusText = "201 Created";
                        } else if (method === "PUT") {
                            const body = JSON.parse(apiPayloadEditor.value);
                            responseData = {
                                success: true,
                                message: "Student record updated successfully",
                                updatedFields: body,
                                timestamp: new Date().toISOString()
                            };
                            statusCode = 200;
                            statusText = "200 OK";
                        } else if (method === "DELETE") {
                            responseData = {
                                success: true,
                                message: "Student record deleted successfully from database",
                                deletedAt: new Date().toISOString()
                            };
                            statusCode = 200;
                            statusText = "200 OK";
                        }
                    } else {
                        responseData = {
                            success: false,
                            message: `Endpoint ${url} not found`
                        };
                        statusCode = 404;
                        statusText = "404 Not Found";
                    }
                } catch (err) {
                    responseData = {
                        success: false,
                        message: "Invalid JSON in request payload",
                        error: err.message
                    };
                    statusCode = 400;
                    statusText = "400 Bad Request";
                }

                const elapsed = Math.round(performance.now() - startTime + Math.random() * 12 + 6);

                if (apiResponseStatus) {
                    apiResponseStatus.textContent = `Status: ${statusText}`;
                    apiResponseStatus.className = `status-badge ${statusCode >= 400 ? 'status-400' : 'status-200'}`;
                }
                if (apiResponseTime) {
                    apiResponseTime.textContent = `Time: ${elapsed}ms`;
                }
                if (apiResponseWindow) {
                    apiResponseWindow.textContent = JSON.stringify(responseData, null, 2);
                }
            });
        }

        // --- E. Assignment 9: Mini Project CRUD Courses Client ---
        let miniCourses = [
            { id: 1, title: "Web Technology & Cloud", code: "IT301", credits: 4, instructor: "Prof. S. Sharma", enrolled: 68 },
            { id: 2, title: "Database Management Systems", code: "IT302", credits: 4, instructor: "Prof. R. Kulkarni", enrolled: 72 },
            { id: 3, title: "Operating Systems Architecture", code: "IT303", credits: 3, instructor: "Prof. A. Patil", enrolled: 65 },
            { id: 4, title: "Computer Networks & Protocols", code: "IT304", credits: 4, instructor: "Prof. M. Deshmukh", enrolled: 70 }
        ];

        const miniCourseGridContainer = document.getElementById("miniCourseGridContainer");
        const miniCourseCountBadge = document.getElementById("miniCourseCountBadge");
        const miniProjectAddCourseForm = document.getElementById("miniProjectAddCourseForm");

        function renderMiniCourses() {
            if (!miniCourseGridContainer) return;
            miniCourseGridContainer.innerHTML = "";

            if (miniCourseCountBadge) {
                miniCourseCountBadge.textContent = `${miniCourses.length} Courses Active`;
            }

            miniCourses.forEach(course => {
                const col = document.createElement("div");
                col.className = "col-md-6";
                col.innerHTML = `
                    <div class="p-3 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="badge bg-primary-subtle text-primary fw-bold">${course.code}</span>
                                <span class="small text-muted">${course.credits} Credits</span>
                            </div>
                            <h6 class="fw-bold mb-1">${course.title}</h6>
                            <div class="small text-secondary mb-1">Instructor: ${course.instructor}</div>
                            <div class="small text-muted">Enrolled: <strong>${course.enrolled}</strong> Students</div>
                        </div>
                        <div class="mt-3 pt-2 border-top d-flex justify-content-end">
                            <button class="btn btn-sm btn-outline-danger py-0 px-2 delete-course-btn" data-id="${course.id}">Delete</button>
                        </div>
                    </div>
                `;
                miniCourseGridContainer.appendChild(col);
            });

            document.querySelectorAll(".delete-course-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = Number(btn.getAttribute("data-id"));
                    miniCourses = miniCourses.filter(c => c.id !== id);
                    renderMiniCourses();
                });
            });
        }

        if (miniProjectAddCourseForm) {
            miniProjectAddCourseForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const code = document.getElementById("miniCourseCode").value.trim().toUpperCase();
                const title = document.getElementById("miniCourseTitle").value.trim();
                const credits = Number(document.getElementById("miniCourseCredits").value);
                const enrolled = Number(document.getElementById("miniCourseEnrolled").value);
                const instructor = document.getElementById("miniCourseInstructor").value.trim();

                const newCourse = {
                    id: Date.now(),
                    code,
                    title,
                    credits,
                    instructor,
                    enrolled
                };

                miniCourses.push(newCourse);
                renderMiniCourses();
                miniProjectAddCourseForm.reset();
                document.getElementById("miniCourseCredits").value = "3";
                document.getElementById("miniCourseEnrolled").value = "60";
            });
        }

        renderMiniCourses();
    }
});

