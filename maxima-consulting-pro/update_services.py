from pathlib import Path
p = Path('/home/ubuntu/maxima-consulting-pro/client/src/pages/Home.tsx')
s = p.read_text()
old = '<article className={`service-card ${i === 1 ? "service-card--featured" : ""} scroll-reveal scroll-reveal--card`} key={service.label}>'
new = '<article className={`service-card ${i === 1 ? "service-card--featured" : ""} ${selectedService === i ? "service-card--selected" : ""} scroll-reveal scroll-reveal--card`} style={{ "--reveal-delay": `${i * 90}ms` } as React.CSSProperties} data-service-index={i} tabIndex={0} role="button" aria-pressed={selectedService === i} onClick={() => setSelectedService(i)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedService(i); } }} key={service.label}>'
if old not in s:
    raise SystemExit('service article pattern not found')
s = s.replace(old, new, 1)
p.write_text(s)
print('Selected service interaction added')
