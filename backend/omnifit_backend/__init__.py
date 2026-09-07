import sys

# Python 3.14 Compatibility Patch for Django Template Context Copying
if sys.version_info >= (3, 14):
    try:
        from django.template.context import BaseContext, RenderContext

        def _base_context_copy(self):
            duplicate = object.__new__(self.__class__)
            duplicate.__dict__.update(self.__dict__)
            duplicate.dicts = self.dicts.copy()
            return duplicate

        BaseContext.__copy__ = _base_context_copy
        RenderContext.__copy__ = _base_context_copy
    except Exception:
        pass
