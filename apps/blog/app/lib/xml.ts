const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" };

export const escapeXml = (s: string) => s.replace(/[&<>"']/g, (c) => ENTITIES[c]);

export const xmlResponse = (body: string) =>
	new Response(`<?xml version="1.0" encoding="UTF-8"?>${body}`, {
		headers: { "Content-Type": "application/xml" },
	});
