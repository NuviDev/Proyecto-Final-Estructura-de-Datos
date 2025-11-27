/* ==========================================
   DATA BANK: ÁRBOL DE WUTHERING WAVES (FINAL)
   ========================================== */

document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. CONFIGURACIÓN ---
    const canvas = document.getElementById('farmingCanvas');
    const container = document.querySelector('.scroll-container');
    const msg = document.getElementById('mensaje-estado');
    
    // Verificación de seguridad
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');

    // Colores del Tema "Data Bank"
    const THEME = {
        bgNode: "#1f2833",       
        borderNode: "#45a29e",   
        borderActive: "#66fcf1", 
        line: "#c5c6c7",         
        text: "#ffffff",
        highlight: "#ffd700",     // Dorado (Items/Astritas)
        gacha: "#ff6b6b"          // Rojo suave para Banners
    };

    // --- 2. DATOS DE FARMEO Y GACHA ---
    const farmingData = {
        id: "root", label: "DATA BANK: WUWA", type: "root", expanded: true, x: 0, y: 0,
        children: [
            // RAMA 1: ASTRITAS (Moneda)
            {
                label: "ASTRITAS 💎", type: "category", expanded: false,
                children: [
                    { label: "Diarias", type: "sub", expanded: false, children: [
                        { label: "Actividad", type: "item", drop: "+60 Astritas" },
                        { label: "Lunite Sub", type: "item", drop: "+90 Astritas" }
                    ]},
                    { label: "Exploración", type: "sub", expanded: false, children: [
                        { label: "Cofres", type: "item", drop: "5-10 Astritas" },
                        { label: "Sonance Casket", type: "item", drop: "Recompensas" }
                    ]},
                    { label: "Endgame", type: "sub", expanded: false, children: [
                        { label: "Torre Adversidad", type: "item", drop: "Reset Periódico" },
                        { label: "Depths Illusive", type: "item", drop: "Tienda Evento" }
                    ]}
                ]
            },
            // RAMA 2: BANNERS (Tiros)
            {
                label: "BANNERS ✦", type: "category", expanded: false,
                children: [
                    { label: "Evento PJ", type: "sub", expanded: false, children: [
                        { label: "Marea Radiante", type: "item", drop: "Personaje Limitado" },
                        { label: "Pity 50/50", type: "item", drop: "80 Tiros" }
                    ]},
                    { label: "Evento Arma", type: "sub", expanded: false, children: [
                        { label: "Marea de Forja", type: "item", drop: "Arma Limitada" },
                        { label: "Pity 100%", type: "item", drop: "80 Tiros" }
                    ]},
                    { label: "Permanente", type: "sub", expanded: false, children: [
                        { label: "Marea Lustrosa", type: "item", drop: "Standard / Selector" }
                    ]}
                ]
            },
            // RAMA 3: MEJORA ARMAS (Materiales)
            {
                label: "ARMAS ⚔️", type: "category", expanded: false,
                children: [
                    { label: "Experiencia", type: "sub", expanded: false, children: [
                        { label: "Energy Core", type: "item", drop: "Simulation Field" }
                    ]},
                    { label: "Ascensión", type: "sub", expanded: false, children: [
                        { label: "Forgery Challenge", type: "item", drop: "Dominios" },
                        { label: "Metallic Drip", type: "item", drop: "Rectifiers/Gauntlets" },
                        { label: "Cadence Seed", type: "item", drop: "Rectifiers" },
                        { label: "Helix", type: "item", drop: "Broadblades" }
                    ]}
                ]
            },
            // RAMA 4: JEFES Y ECOS
            {
                label: "ECOS / BOSS", type: "category", expanded: false,
                children: [
                    { label: "Overlord (4 Cost)", type: "sub", expanded: false, children: [
                        { label: "Tempest Mephis", type: "item", drop: "Electro Set" },
                        { label: "Inferno Rider", type: "item", drop: "Fusion Set" },
                        { label: "Dreamless", type: "item", drop: "Havoc Set" }
                    ]},
                    { label: "Calamity", type: "sub", expanded: false, children: [
                        { label: "Bell-Borne", type: "item", drop: "Defensa / Escudo" },
                        { label: "Jue", type: "item", drop: "Spectro Skill" }
                    ]}
                ]
            }
        ]
    };

    // Variables de Layout
    const NODE_WIDTH = 150; 
    const NODE_HEIGHT = 50;
    const V_SPACING = 80;
    const H_SPACING = 30;
    let visibleNodes = [];

    // --- 3. FUNCIONES DE LÓGICA (LAYOUT) ---

    function updateCanvasSize() {
        let maxX = 0;
        let maxY = 0;
        visibleNodes.forEach(n => {
            if (n.x + NODE_WIDTH > maxX) maxX = n.x + NODE_WIDTH;
            if (n.y + NODE_HEIGHT > maxY) maxY = n.y + NODE_HEIGHT;
        });
        
        // Ajuste dinámico: Si el árbol es pequeño, usar ancho del contenedor.
        canvas.width = Math.max(container.clientWidth, maxX + 50); 
        canvas.height = Math.max(container.clientHeight, maxY + 100);
        
        drawTree();
    }

    function calculateLayout(node, level) {
        if (!node.expanded || !node.children || node.children.length === 0) {
            node.widthTotal = NODE_WIDTH + H_SPACING;
            return;
        }

        let currentWidth = 0;
        node.children.forEach(child => {
            calculateLayout(child, level + 1);
            currentWidth += child.widthTotal;
        });

        node.widthTotal = currentWidth;
    }

    function assignCoordinates(node, x, y) {
        node.x = x + (node.widthTotal / 2) - (NODE_WIDTH / 2);
        node.y = y;
        visibleNodes.push(node);

        if (node.expanded && node.children) {
            let currentX = x;
            node.children.forEach(child => {
                assignCoordinates(child, currentX, y + V_SPACING);
                currentX += child.widthTotal;
            });
        }
    }

    function refreshTree() {
        visibleNodes = [];
        calculateLayout(farmingData, 0);
        
        const totalW = farmingData.widthTotal;
        // Centrado inteligente
        let startX = (canvas.width > totalW) ? (canvas.width / 2) - (totalW / 2) : 20;
        if(startX < 20) startX = 20;

        assignCoordinates(farmingData, startX, 40);
        updateCanvasSize();
    }

    // --- 4. DIBUJO ---

    function drawTree() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Líneas
        ctx.lineWidth = 2;
        ctx.strokeStyle = THEME.line;
        visibleNodes.forEach(node => {
            if (node.expanded && node.children) {
                node.children.forEach(child => {
                    ctx.beginPath();
                    ctx.moveTo(node.x + NODE_WIDTH/2, node.y + NODE_HEIGHT);
                    ctx.lineTo(node.x + NODE_WIDTH/2, node.y + NODE_HEIGHT + V_SPACING/2);
                    ctx.lineTo(child.x + NODE_WIDTH/2, node.y + NODE_HEIGHT + V_SPACING/2);
                    ctx.lineTo(child.x + NODE_WIDTH/2, child.y);
                    ctx.stroke();
                });
            }
        });

        // Nodos
        visibleNodes.forEach(drawNode);
    }

    function drawNode(node) {
        ctx.fillStyle = THEME.bgNode;
        ctx.fillRect(node.x, node.y, NODE_WIDTH, NODE_HEIGHT);
        
        let borderColor = node.expanded ? THEME.borderActive : THEME.borderNode;
        if(node.type === "item") borderColor = THEME.highlight;
        if(node.label.includes("BANNERS") || node.label.includes("Marea")) borderColor = THEME.gacha;

        ctx.strokeStyle = borderColor;
        ctx.lineWidth = node.expanded ? 3 : 1;
        ctx.strokeRect(node.x, node.y, NODE_WIDTH, NODE_HEIGHT);

        // Glow
        if (node.expanded || node.type === "item") {
            ctx.shadowBlur = 10;
            ctx.shadowColor = borderColor;
        } else {
            ctx.shadowBlur = 0;
        }

        // Texto
        ctx.fillStyle = THEME.text;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (node.type === "item") {
             ctx.fillText(node.label, node.x + NODE_WIDTH/2, node.y + 16);
             ctx.fillStyle = THEME.highlight;
             ctx.font = "italic 10px monospace";
             ctx.fillText("[" + node.drop + "]", node.x + NODE_WIDTH/2, node.y + 34);
        } else {
            ctx.fillText(node.label, node.x + NODE_WIDTH/2, node.y + NODE_HEIGHT/2);
            if (node.children && node.children.length > 0) {
                const icon = node.expanded ? "[-]" : "[+]";
                ctx.fillStyle = borderColor;
                ctx.font = "10px monospace";
                ctx.fillText(icon, node.x + NODE_WIDTH - 15, node.y + 12);
            }
        }
        ctx.shadowBlur = 0;
    }

    // --- 5. INTERACCIÓN ---
    
    canvas.addEventListener('click', (e) => {
        const mouseX = e.offsetX; 
        const mouseY = e.offsetY;

        for (let i = visibleNodes.length - 1; i >= 0; i--) {
            const n = visibleNodes[i];
            if (mouseX >= n.x && mouseX <= n.x + NODE_WIDTH &&
                mouseY >= n.y && mouseY <= n.y + NODE_HEIGHT) {
                
                if (n.children && n.children.length > 0) {
                    n.expanded = !n.expanded;
                    if(!n.expanded) collapseChildren(n);
                    
                    msg.innerText = `Cargando datos: ${n.label}...`;
                    msg.style.color = THEME.borderActive;
                    refreshTree();
                } else if (n.type === "item") {
                    msg.innerText = `Info: ${n.label} -> ${n.drop}`;
                    msg.style.color = THEME.highlight;
                }
                break;
            }
        }
    });

    function collapseChildren(node) {
        if(node.children) {
            node.children.forEach(c => {
                c.expanded = false;
                collapseChildren(c);
            });
        }
    }

    window.resetFarmingTree = function() {
        collapseChildren(farmingData);
        farmingData.expanded = true; 
        refreshTree();
        msg.innerText = "Sistema reiniciado.";
        msg.style.color = "#888";
    };

    window.addEventListener('resize', () => {
        setTimeout(refreshTree, 100);
    });
    
    // Inicio
    setTimeout(refreshTree, 100);
});