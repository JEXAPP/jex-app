from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):

    role = serializers.ChoiceField(choices=['empleado', 'empleador', 'admin'], required=True)
    password2 = serializers.CharField(style={'input_type': 'password'},write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')

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

        # Validar que el role exista en los grupos
        role = attrs.get('role')
        if not Group.objects.filter(name=role).exists():
            raise serializers.ValidationError({"role": "El rol seleccionado no existe."})

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
        group = Group.objects.get(name=validated_data['role'])
        user.groups.add(group)
        return user
    
class UserLoginSerializer(serializers.Serializer):

    username = serializers.CharField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise serializers.ValidationError("La cuenta está desactivada.")
            else:
                raise serializers.ValidationError("Credenciales inválidas.")
        else:
            raise serializers.ValidationError("Debe ingresar nombre de usuario y contraseña.")
        return attrs