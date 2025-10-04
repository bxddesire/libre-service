// balises personnalisées — 
           // à ajouter dans Modules > Gestion des codes javascript
	// cocher "Sur toutes les pages" !

$(document).ready(function () {
    const waitForSCEditor = setInterval(() => {
        if ($('.sceditor-toolbar').length && $('.sceditor-container').length) {
            clearInterval(waitForSCEditor); 

            // Contenu du panneau custom avec boutons de balises personnalisées - chevron FontAwesome, à installer ou retirer si inutile !
            const panelHTML = `
                <button class="toggle-panel">
                    <i class="fa-solid fa-chevron-down" style="padding-right: 3px"></i> 
                    Afficher les balises
                </button>
                <div class="editor-panel" style="display: none;">
                    <div class="panel-content">

                        <!-- Liste des balises à insérer -->
                        ${[
                          'i2',       // ici par exemple il s'agirait de <i2></i2>     
                            'unebalise', // et ici de <unebalise></unebalise>
                            'uneautre'  // à compléter librement en séparant par une virgule !
                        ].map(tag => `<button type="button" data-tag="${tag}"><${tag}>texte</${tag}></button>`).join('')}

                    </div>
                </div>
            `;

            // Ajoute le panneau juste après la barre d’outils de SCEditor
            $('.sceditor-toolbar').after(panelHTML);

            /* Fonction principale : insère les balises dans le bon mode (source ou visuel)
             */
            function insertTag(tag) {
                const editorTextarea = $(".sourceMode textarea"); 
                const editorIframe = $(".sceditor-container iframe").contents().find("body"); // mode "visuel"

                if (editorTextarea.length && editorTextarea.is(":visible")) {
                    // Insertion dans le mode source
                    const textarea = editorTextarea[0];
                    const start = textarea.selectionStart;
                    const end = textarea.selectionEnd;
                    const text = textarea.value;

                    textarea.value = text.substring(0, start) + `<${tag}>` + text.substring(start, end) + `</${tag}>` + text.substring(end);
                    textarea.selectionStart = textarea.selectionEnd = end + tag.length * 2 + 5; // repositionne le curseur après la balise
                    textarea.focus();
                } else if (editorIframe.length) {
                    // Insertion dans le mode visuel (rich text)
                    const selection = window.getSelection();
                    if (!selection.rangeCount) return;

                    const range = selection.getRangeAt(0);
                    const span = document.createElement("span");
                    span.innerHTML = `<${tag}>${range.toString()}</${tag}>`;
                    range.deleteContents();
                    range.insertNode(span);
                }
            }

            // Cliquer sur un bouton → insère la balise correspondante
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
                        ? '<i class="fa-solid fa-chevron-up" style="padding-right: 3px"></i> Masquer les balises'
                        : '<i class="fa-solid fa-chevron-down" style="padding-right: 3px"></i> Afficher les balises'
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
        /* Style des boutons-balise */
        .panel-content button {
            margin: 2px;
            padding: 4px 8px;
            background-color: #f0f0f0;
            color: #222;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: inherit;
            font-size: 13px;
            cursor: pointer;
        }

        .panel-content button:hover {
            background-color: #e0e0e0;
        }

        /* Bouton toggle pour afficher/masquer le panneau */
        button.toggle-panel {
            margin: 8px 0;
            width: 100%;
            background-color: #444;
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
            background-color: #333;
        }

        /* Conteneur du panneau */
        .editor-panel {
            margin-top: 8px;
        }
    `)
    .appendTo('head');
