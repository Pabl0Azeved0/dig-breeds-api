import type { Directive } from 'vue';

// WeakMap to keep track of observers for each element
const observers = new WeakMap<Element, IntersectionObserver>();

export const lazyLoadDirective: Directive<HTMLElement, () => void> = {
  mounted(el, binding) {
    // The function to call when the element is visible
    const onIntersection: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Element is visible, so call the provided function
          binding.value();
          // Stop observing this element since the work is done
          observer.unobserve(el);
          observers.delete(el);
        }
      });
    };

    const observer = new IntersectionObserver(onIntersection, {
      rootMargin: '100px', // Start loading when the image is 100px away from the viewport
    });

    observer.observe(el);
    observers.set(el, observer);
  },
  beforeUnmount(el) {
    // Clean up the observer when the component is destroyed
    if (observers.has(el)) {
      observers.get(el)?.disconnect();
      observers.delete(el);
    }
  },
};