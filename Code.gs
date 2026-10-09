// ===== CONFIGURACIÓN =====
const CARPETA_ID   = "1eEsqHabH6ZoGH0cI9YiQREzmmCWfblXK"; // la parte final de la URL de la carpeta
const EMAIL_OFICINA = "miquelpi@termotur.com";
 
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const fecha = Utilities.formatDate(new Date(d.fecha), "Europe/Madrid", "yyyy-MM-dd_HHmm");
    const nombre = `${limpiar(d.cliente)}_${fecha}.pdf`;
 
    // Carpeta por cliente dentro de la carpeta raíz
    const raiz = DriveApp.getFolderById(eEsqHabH6ZoGH0cI9YiQREzmmCWfblXK);
    const it = raiz.getFoldersByName(limpiar(d.cliente));
    const carpeta = it.hasNext() ? it.next() : raiz.createFolder(limpiar(d.cliente));
 
    const blob = Utilities.newBlob(Utilities.base64Decode(d.pdf), "application/pdf", nombre);
    const archivo = carpeta.createFile(blob);
 
    const destinos = ["miquelpi@termotur.com", d.emailCliente].filter(Boolean).join(",");
    MailApp.sendEmail({
      to: destinos,
      subject: `Revisión ${d.cliente} - ${d.equipo || ""}`,
      body: `Revisión realizada por ${d.operario}.\nPDF adjunto.\nCopia en Drive: ${archivo.getUrl()}`,
      attachments: [blob]
    });
    return salida({ ok: true });
  } catch (err) {
    return salida({ ok: false, error: String(err) });
  }
}
 
function limpiar(s) { return String(s || "sin_nombre").replace(/[\\/:*?"<>|]/g, "-").trim(); }
function salida(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
 
