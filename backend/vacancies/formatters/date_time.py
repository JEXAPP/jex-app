from rest_framework import serializers

class CustomDateField(serializers.DateField):
    def __init__(self, **kwargs):
        kwargs['input_formats'] = ['%d/%m/%Y']
        super().__init__(**kwargs)

    def to_representation(self, value):
        if not value:
            return None
        return value.strftime('%d/%m/%Y')


class CustomTimeField(serializers.TimeField):
    def __init__(self, **kwargs):
        kwargs['input_formats'] = ['%H:%M']
        super().__init__(**kwargs)

    def to_representation(self, value):
        if not value:
            return None
        return value.strftime('%H:%M')