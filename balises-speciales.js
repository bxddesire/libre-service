// balises personnalisées — 
// à ajouter dans Modules > Gestion des codes javascript
// cocher "Sur toutes les pages" !

$(document).ready(function () {
    const waitForSCEditor = setInterval(() => {
        if ($('.sceditor-toolbar').length && $('.sceditor-container').length) {
            clearInterval(waitForSCEditor); 

            // Contenu du panneau custom avec boutons de balises personnalisées
            const panelHTML = `
                <button class="toggle-panel">
                    <i class="fa-solid fa-chevron-down" style="padding-right: 3px"></i> 
                    Afficher l'éditeur
                </button>
                <div class="editor-panel" style="display: none;">
                    <div class="panel-content">

                        <!-- Liste des balises à insérer -->
                        ${[
                            'i2',        // Exemple : <i2></i2>
                            'unebalise', // Exemple : <unebalise></unebalise>
                            'uneautre'   // Ajoute librement tes balises ici
                        ].map(tag => `<button type="button" data-tag="${tag}"><${tag}>texte</${tag}></button>`).join('')}

                    </div>
                </div>
            `;

            // Ajoute le panneau juste après la barre d’outils de SCEditor
            $('.sceditor-toolbar').after(panelHTML);

            /**
             * Fonction principale : insère les balises dans le bon mode (source ou visuel)
             */
            function insertTag(tag) {
                const editorTextarea = $(".sourceMode textarea");
                const editorIframe = $(".sceditor-container iframe").contents().find("body");

                if (editorTextarea.length && editorTextarea.is(":visible")) {
                    // Mode source : insertion directe dans le texte
                    const textarea = editorTextarea[0];
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;

                    const openTag = `<${tag}>`;
                    const closeTag = `</${tag}>`;

                    textarea.value = text.substring(0, start) + openTag + text.substring(start, end) + closeTag + text.substring(end);

                    // Place le curseur ENTRE les balises
                    textarea.selectionStart = textarea.selectionEnd = start + openTag.length;
                    textarea.focus();

                } else if (editorIframe.length) {
                    // Mode visuel : insertion dans le contenu rich text
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return;

                    const range = selection.getRangeAt(0);
                    const span = document.createElement("span");
                    span.innerHTML = `<${tag}></${tag}>`;

                    // Insère la balise et place le curseur entre les deux
                    range.deleteContents();
                    range.insertNode(span);

                    const newRange = document.createRange();
                    const inside = span.querySelector(tag);
                    if (inside) {
                        newRange.setStart(inside, 0);
                        newRange.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }

                    editorIframe.focus();
                }
            }

            // Clique sur un bouton → insère la balise correspondante
            $('.editor-panel .panel-content button').on('click', function (e) {
                e.preventDefault();
                insertTag($(this).data('tag'));
            });

            // Toggle pour afficher ou masquer le panneau
            $('.toggle-panel').on('click', function (e) {
                e.preventDefault();
                $('.editor-panel').slideToggle(300, () => {
                    const visible = $('.editor-panel').is(':visible');
                    $(this).html(visible
                        ? '<i class="fa-solid fa-chevron-up" style="padding-right: 3px"></i> Cacher l\'éditeur'
                        : '<i class="fa-solid fa-chevron-down" style="padding-right: 3px"></i> Afficher l\'éditeur'
                    );
                });
            });
        }
    }, 500);
});

// STYLES : personnalisation visuelle du panneau et des boutons
$('<style>')
    .prop('type', 'text/css')
    .html(`
        /* Style du fond global */
        .panel-content {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }

        /* Style des boutons-balises */
        .panel-content button {
            background: none;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 4px 8px;
            color: #222;
            font-family: inherit;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .panel-content button:hover {
            background-color: #e0e0e0;
        }

        /* Bouton toggle pour afficher/masquer le panneau */
        button.toggle-panel {
            margin: 8px 0;
            width: 100%;
            background: linear-gradient(90deg, #d973a1, #b57fe0);
            color: #fff;
            font-size: 14px;
            line-height: 24px;
            text-transform: lowercase;
            padding: 6px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        button.toggle-panel:hover {
            filter: brightness(0.95);
        }

        .editor-panel {
            margin-top: 8px;
        }
    `)
    .appendTo('head');
