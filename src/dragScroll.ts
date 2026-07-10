// Enables click-and-drag horizontal scrolling on an element (mouse acts like a
// finger swiping). Returns a cleanup function. A drag that moves past a small
// threshold cancels the trailing click so buttons don't fire after a swipe.
export function attachDragScroll(el: HTMLElement): () => void {
  let isDown = false;
  let startX = 0;
  let startLeft = 0;
  let didDrag = false;
  let suppressClick = false;
  let suppressTimer: number | undefined;

  const onDown = (e: MouseEvent) => {
    isDown = true;
    didDrag = false;
    startX = e.pageX;
    startLeft = el.scrollLeft;
  };

  const onMove = (e: MouseEvent) => {
    if (!isDown) return;
    const dx = e.pageX - startX;
    if (Math.abs(dx) > 8) {
      didDrag = true;
      el.classList.add("dragging");
    }
    el.scrollLeft = startLeft - dx;
  };

  const onUp = () => {
    if (!isDown) return;
    isDown = false;
    el.classList.remove("dragging");
    if (didDrag) {
      suppressClick = true;
      window.clearTimeout(suppressTimer);
      suppressTimer = window.setTimeout(() => {
        suppressClick = false;
      }, 120);
    }
  };

  const onClickCapture = (e: MouseEvent) => {
    if (suppressClick) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
      window.clearTimeout(suppressTimer);
    }
  };

  el.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  el.addEventListener("click", onClickCapture, true);

  return () => {
    el.removeEventListener("mousedown", onDown);
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mouseup", onUp);
    el.removeEventListener("click", onClickCapture, true);
    window.clearTimeout(suppressTimer);
  };
}

// Attach drag-scroll to every horizontal carousel (they all use `.no-scrollbar`).
export function initDragScroll(root: ParentNode = document): () => void {
  const rows = root.querySelectorAll<HTMLElement>(".no-scrollbar");
  const cleanups = Array.from(rows).map(attachDragScroll);
  return () => cleanups.forEach((fn) => fn());
}
