from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):

    password2 = serializers.CharField(style={'input_type': 'password'},write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Validar que el email tenga formato correcto
        email = attrs.get('email')
        if not email or not serializers.EmailField().run_validation(email):
            raise serializers.ValidationError({"email": "Ingrese un email válido."})

        # Validar que el username sea único
        username = attrs.get('username')
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"username": "El nombre de usuario ya existe."})

        # Validar que el email sea único
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "El email ya está registrado."})

        # Validar tipos de datos básicos
        if not isinstance(username, str) or not isinstance(email, str):
            raise serializers.ValidationError("Username y email deben ser cadenas de texto.")

        return attrs

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class AssignRoleSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    role = serializers.ChoiceField(choices=['empleador', 'empleado'])

    def validate_user_id(self, value):
        if not User.objects.filter(id=value).exists():
            raise serializers.ValidationError("Usuario no encontrado.")
        return value

    def save(self):
        user_id = self.validated_data['user_id']
        role = self.validated_data['role']
        user = User.objects.get(id=user_id)
        user.groups.clear()
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)
        user.save()
        return user
